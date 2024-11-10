import { getInputProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { db } from '~/db'
import { users } from '~/db/schema'
import { createUserSession, getUser } from '~/utils/auth.server'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'Please select a role',
  }),
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
  const submission = parseWithZod(formData, { schema: signupSchema })

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      // You can also use the status to determine the HTTP status code
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  const { email, name, password, role } = submission.value

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (existingUser) {
    return json(
      {
        ...submission,
        error: { email: ['A user with this email already exists'] },
      },
      { status: 400 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const userId = nanoid()

  await db.insert(users).values({
    email,
    hashedPassword,
    id: userId,
    name,
    role,
  })

  return createUserSession(userId, '/')
}

export default function Signup() {
  const lastResult = useActionData<typeof action>()
  const [form, fields] = useForm({
    constraint: getZodConstraint(signupSchema),
    id: 'signup-form',
    // Sync the result of last submission
    lastResult,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  })

  console.log('Signup', {
    fields,
    form,
    lastResult,
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account!
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
              <Label htmlFor={fields.name.id}>Full Name</Label>
              <Input
                {...getInputProps(fields.name, { type: 'text' })}
                autoComplete="name"
                type="text"
              />
              {fields.name.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.name.errors}
                </p>
              )}
            </div>

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
                autoComplete="new-password"
                type="password"
              />
              {fields.password.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.password.errors}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fields.role.id}>I am a</Label>
              <Select
                {...getSelectProps(fields.role)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              {fields.role.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.role.errors}
                </p>
              )}
            </div>
          </div>

          {form.errors && <p className="text-sm text-red-600">{form.errors}</p>}

          <div>
            <Button
              className="w-full"
              type="submit"
            >
              Sign up
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
