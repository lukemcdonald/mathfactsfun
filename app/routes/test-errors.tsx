import { data, Form, useActionData, useLoaderData, useNavigation } from 'react-router'

import { z } from 'zod'

import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { useToast } from '#app/hooks/use-toast'
import { DatabaseError } from '#app/utils/errors'

const testSchema = z.object({
  name: z.string().min(3),
})

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const type = formData.get('type')

  try {
    switch (type) {
      case 'async': {
        throw new Error('Test async error')
      }

      case 'database': {
        throw new DatabaseError('Test database error', null, {
          context: 'Testing database error handling',
        })
      }

      case 'unhandled': {
        throw new Error('Test unhandled error')
      }

      case 'validation': {
        const result = testSchema.safeParse({ name: 'a' })
        if (!result.success) {
          return data(
            {
              details: result.error.errors,
              error: 'Validation failed',
            },
            { status: 400 },
          )
        }
        return data({ message: 'Validation passed', success: true })
      }

      case 'toast': {
        return data({ message: 'This is a test toast message!', success: true })
      }

      default: {
        return data({ message: 'Operation completed successfully', success: true })
      }
    }
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      return data({ details: error.message, error: 'Database error occurred' }, { status: 500 })
    }

    if (error instanceof Error) {
      return data({ error: error.message }, { status: 500 })
    }

    return data({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function loader() {
  return { timestamp: Date.now() }
}

export default function TestErrors() {
  const { timestamp } = useLoaderData<typeof loader>()
  const actionData = useActionData<{
    error?: string
    message?: string
    details?: unknown
    success?: boolean
  }>()
  const navigation = useNavigation()
  const { toast } = useToast()

  // Handle toast notifications based on action data and navigation state
  if (actionData?.message && navigation.state === 'idle') {
    toast({
      description: actionData.message,
      title: 'Success',
    })
  } else if (actionData?.error && navigation.state === 'idle') {
    const description =
      actionData.details ?
        `${actionData.error}: ${JSON.stringify(actionData.details)}`
      : actionData.error

    toast({
      description,
      title: 'Error',
      variant: 'destructive',
    })
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Error Handling Test Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                toast({
                  description: 'This is a client-side toast notification',
                  title: 'Client Toast',
                })
              }}
              variant="outline"
            >
              Show Client Toast
            </Button>

            <Button
              onClick={() => {
                throw new Error('Test client-side error')
              }}
              variant="destructive"
            >
              Trigger Client Error
            </Button>

            <div>
              <p className="text-sm text-muted-foreground">
                Last rendered: {new Date(timestamp).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form method="post">
              <input
                name="type"
                type="hidden"
                value="toast"
              />
              <Button
                className="w-full"
                type="submit"
                variant="outline"
              >
                Test Toast Message
              </Button>
            </Form>

            <Form method="post">
              <input
                name="type"
                type="hidden"
                value="validation"
              />
              <Button
                className="w-full"
                type="submit"
                variant="outline"
              >
                Test Validation Error
              </Button>
            </Form>

            <Form method="post">
              <input
                name="type"
                type="hidden"
                value="database"
              />
              <Button
                className="w-full"
                type="submit"
                variant="outline"
              >
                Test Database Error
              </Button>
            </Form>

            <Form method="post">
              <input
                name="type"
                type="hidden"
                value="unhandled"
              />
              <Button
                className="w-full"
                type="submit"
                variant="outline"
              >
                Test Unhandled Error
              </Button>
            </Form>

            <Form method="post">
              <input
                name="type"
                type="hidden"
                value="async"
              />
              <Button
                className="w-full"
                type="submit"
                variant="outline"
              >
                Test Async Error
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Testing Instructions:</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Open your Sentry dashboard at{' '}
            <a
              className="text-primary hover:underline"
              href="https://lukemcdonald.sentry.io/issues/?project=4508314099777536"
              rel="noopener noreferrer"
              target="_blank"
            >
              Sentry Issues
            </a>
          </li>
          <li>Click each button above to trigger different types of errors and toasts</li>
          <li>Verify that errors appear in Sentry with proper context and stack traces</li>
          <li>Check that validation errors show up as toast messages</li>
          <li>Confirm that database errors trigger the appropriate error handling flow</li>
          <li>Test that client-side toast notifications work as expected</li>
        </ol>
      </div>
    </div>
  )
}
