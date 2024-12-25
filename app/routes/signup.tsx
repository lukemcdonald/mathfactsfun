import { data, redirect, Form, Link, useActionData, useNavigation } from 'react-router'

import { getInputProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { Button } from '#app/components/ui/button'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#app/components/ui/select'
import { getRoute } from '#app/config/routes'
import { db } from '#app/db/db.server'
import { createUserSession, getUser } from '#app/features/auth/auth.api.server'
import { hashPassword } from '#app/features/auth/auth.utils'
import { addBreadcrumb } from '#app/features/monitoring/monitoring.api'
import { createUser, getUserByEmail } from '#app/features/users/users.api.server'
import { handleError } from '#app/utils/errors'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'Please select a role',
  }),
})

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema: signupSchema })

    if (submission.status !== 'success') {
      addBreadcrumb({
        category: 'auth',
        data: { errors: submission.error },
        level: 'warning',
        message: 'Signup validation failed',
      })
      return data(submission.reply(), { status: 400 })
    }

    const { email, name, password, role } = submission.value
    const existingUser = await getUserByEmail(db, email)

    if (existingUser) {
      addBreadcrumb({
        category: 'auth',
        data: {
          email,
          reason: 'Email already exists',
        },
        level: 'warning',
        message: 'Signup failed',
      })
      return data(
        {
          ...submission,
          error: { email: ['A user with this email already exists'] },
        },
        { status: 400 },
      )
    }

    const hashedPassword = await hashPassword(password)
    const userId = nanoid()

    await createUser(db, {
      email,
      hashedPassword,
      id: userId,
      name,
      role,
    })

    addBreadcrumb({
      category: 'auth',
      data: {
        email,
        role,
        userId,
      },
      level: 'info',
      message: 'Signup successful',
    })

    return createUserSession(userId, getRoute.home())
  } catch (error) {
    return handleError(error, { path: getRoute.auth.signup() })
  }
}

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  if (user) {
    return redirect(getRoute.dashboard.byRole(user.role))
  }
  return {}
}

export default function Signup() {
  const lastResult = useActionData<typeof action>()
  const navigation = useNavigation()
  const isLoading = navigation.state === 'submitting'

  const [form, fields] = useForm({
    constraint: getZodConstraint(signupSchema),
    id: 'signup-form',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              className="font-medium text-primary hover:text-primary/90"
              to={getRoute.auth.login()}
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <Form
          className="mt-8 space-y-6"
          id={form.id}
          method="post"
          noValidate
          onSubmit={form.onSubmit}
        >
          {form.errors && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{form.errors}</div>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor={fields.name.id}>Full Name</Label>
              <Input
                {...getInputProps(fields.name, { type: 'text' })}
                autoComplete="name"
                type="text"
              />
              {fields.name.errors && (
                <p className="mt-1 text-sm text-red-600">{fields.name.errors}</p>
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
                <p className="mt-1 text-sm text-red-600">{fields.email.errors}</p>
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
                <p className="mt-1 text-sm text-red-600">{fields.password.errors}</p>
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
                <p className="mt-1 text-sm text-red-600">{fields.role.errors}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              className="w-full"
              isLoading={isLoading}
              loadingText="Creating account..."
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
