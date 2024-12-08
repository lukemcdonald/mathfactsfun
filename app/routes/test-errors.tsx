import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { z } from 'zod'

import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { DatabaseError, handleError } from '#app/utils/errors'

const testSchema = z.object({
  name: z.string().min(3),
})

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const type = formData.get('type')

  switch (type) {
    case 'async': {
      await new Promise((_, reject) => setTimeout(() => reject(new Error('Test async error')), 100))
      break
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
        return handleError(result.error)
      }
      break
    }
  }

  return json({ success: true })
}

export async function loader() {
  return json({ timestamp: Date.now() })
}

export default function TestErrors() {
  const { timestamp } = useLoaderData<typeof loader>()

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
          <li>Click each button above to trigger different types of errors</li>
          <li>Verify that errors appear in Sentry with proper context and stack traces</li>
          <li>Check that validation errors are handled locally and not sent to Sentry</li>
          <li>Confirm that database errors trigger the appropriate error handling flow</li>
        </ol>
      </div>
    </div>
  )
}
