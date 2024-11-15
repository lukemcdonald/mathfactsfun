import { getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createUserSession, getUser, verifyLogin } from '~/services/auth.server'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirectTo: z.string().default('/'),
})

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  if (user) {
    return redirect(`/dashboard/${user.role}`)
  }
  return json({})
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: loginSchema })

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      // You can also use the status to determine the HTTP status code
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  const { email, password, redirectTo } = submission.value
  const user = await verifyLogin(email, password)

  if (!user) {
    return json(
      {
        ...submission,
        error: { '': ['Invalid email or password'] },
      },
      { status: 400 },
    )
  }

  return createUserSession(user.id, redirectTo)
}

export default function Login() {
  const lastResult = useActionData<typeof action>()
  const [form, fields] = useForm({
    constraint: getZodConstraint(loginSchema),
    id: 'login-form',
    lastResult, // Sync the result of last submission
    onValidate({ formData }) {
      // Reuse the validation logic on the client
      return parseWithZod(formData, { schema: loginSchema })
    },
    shouldRevalidate: 'onBlur',
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Form
          className="mt-8 space-y-6"
          id={form.id}
          method="post"
          noValidate
          onSubmit={form.onSubmit}
        >
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor={fields.email.id}>Email address</Label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                autoComplete="email"
                type="email"
              />
              {fields.email.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.email.errors}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                {...getInputProps(fields.password, { type: 'password' })}
                autoComplete="current-password"
                type="password"
              />
              {fields.password.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.password.errors}
                </p>
              )}
            </div>
          </div>

          {form.errors && (
            <div className="text-sm text-red-600">{form.errors}</div>
          )}

          <div>
            <Button
              className="w-full"
              type="submit"
            >
              Sign in
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
