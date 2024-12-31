import { redirect, Form, Link, useNavigation } from 'react-router'

import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { FormErrors } from '#app/components/common/form-errors'
import { InputField } from '#app/components/common/input-field'
import { SelectField } from '#app/components/common/select-field'
import { Button } from '#app/components/ui/button'
import { getRoute } from '#app/config/routes'
import { db } from '#app/db/db.server'
import { createUserSession, getUser } from '#app/features/auth/auth.server'
import { hashPassword } from '#app/features/auth/auth.utils'
import { createUser, getUserByEmail } from '#app/features/users/users.server'

import type { Route } from './+types/signup'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'Please select a role',
  }),
})

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request)
  if (!user) {
    return null
  }
  return redirect(getRoute.dashboard.byRole(user.role))
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation()

  const lastResult = actionData
  const isSubmitting = navigation.state === 'submitting'

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
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
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
          <FormErrors errors={form.errors} />

          {/** TODO: Add a fieldset for the form */}
          <div className="space-y-4 rounded-md shadow-sm">
            <InputField
              field={fields.name}
              label="Full Name"
              type="text"
              autoComplete="name"
            />

            <InputField
              field={fields.email}
              label="Email address"
              type="email"
              autoComplete="email"
            />

            <InputField
              field={fields.password}
              label="Password"
              type="password"
              autoComplete="new-password"
            />

            <SelectField
              field={fields.role}
              label="I am a"
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Teacher', value: 'teacher' },
              ]}
            />
          </div>

          <div>
            <Button
              className="w-full"
              isLoading={isSubmitting}
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: signupSchema })

  if (submission.status !== 'success') {
    throw new Response('Signup validation failed', { status: 400 })
  }

  const { email, name, password, role } = submission.value
  const existingUser = await getUserByEmail(db, email)

  if (existingUser) {
    throw new Response('A user with this email already exists', { status: 400 })
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

  return createUserSession(userId, getRoute.home())
}
