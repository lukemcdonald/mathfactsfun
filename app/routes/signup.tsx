import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { useForm, getSelectProps, getInputProps } from '@conform-to/react'

import { getZodConstraint, parseWithZod } from '@conform-to/zod'
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
import bcrypt from 'bcryptjs'
import { db } from '~/db'
import { users } from '~/db/schema'
import { createUserSession, getUserId } from '~/utils/auth.server'
import { nanoid } from 'nanoid'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'Please select a role',
  }),
})

export async function loader({ request }: { request: Request }) {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
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

  const { email, password, name, role } = submission.value

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
    id: userId,
    email,
    name,
    role,
    hashedPassword,
  })

  return createUserSession(userId, '/')
}

export default function Signup() {
  const lastSubmission = useActionData<typeof action>()
  const [form, fields] = useForm({
    id: 'signup-form',
    constraint: getZodConstraint(signupSchema),
    lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema })
    },
    shouldRevalidate: 'onBlur',
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <Form
          method="post"
          {...form.props}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor={fields.name.id}>Full Name</Label>
              <Input
                {...getInputProps(fields.name, { type: 'text' })}
                type="text"
                autoComplete="name"
              />
              {fields.name.error && (
                <p className="mt-1 text-sm text-red-600">{fields.name.error}</p>
              )}
            </div>

            <div>
              <Label htmlFor={fields.email.id}>Email address</Label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                type="email"
                autoComplete="email"
              />
              {fields.email.error && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.email.error}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                {...getInputProps(fields.password, { type: 'password' })}
                type="password"
                autoComplete="new-password"
              />
              {fields.password.error && (
                <p className="mt-1 text-sm text-red-600">
                  {fields.password.error}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fields.role.id}>I am a</Label>
              <Select
                {...getSelectProps(fields.role)}
                defaultValue="student"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              {fields.role.error && (
                <p className="mt-1 text-sm text-red-600">{fields.role.error}</p>
              )}
            </div>
          </div>

          {form.error && <p className="text-sm text-red-600">{form.error}</p>}

          <div>
            <Button
              type="submit"
              className="w-full"
            >
              Sign up
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
