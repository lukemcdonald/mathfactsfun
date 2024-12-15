import { ReactNode, type ReactElement } from 'react'

import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { captureRemixErrorBoundaryError } from '@sentry/remix'

import { getErrorMessage } from '#app/utils/errors'

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => ReactElement | null

function ErrorBoundaryCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">{children}</div>
    </div>
  )
}

function ErrorBoundaryTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-4 text-2xl font-bold text-red-600">{children}</h1>
}

function ErrorBoundaryDescription({ children }: { children: ReactNode }) {
  return <p className="text-gray-600">{children}</p>
}

function ErrorBoundaryMessage({ error }: { error: unknown }) {
  if (!import.meta.env.DEV) {
    return null
  }
  const message = getErrorMessage(error)

  if (!message) {
    return null
  }

  return (
    <pre className="mt-4 max-w-lg overflow-auto rounded bg-gray-100 p-4 text-left text-sm">
      {message}
    </pre>
  )
}

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <ErrorBoundaryCard>
      <ErrorBoundaryTitle>
        {error.status}: {error.statusText}
      </ErrorBoundaryTitle>
      <ErrorBoundaryDescription>{error.data}</ErrorBoundaryDescription>
    </ErrorBoundaryCard>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => (
    <ErrorBoundaryCard>
      <ErrorBoundaryTitle>Oops!</ErrorBoundaryTitle>
      <ErrorBoundaryDescription>Something went wrong.</ErrorBoundaryDescription>
      <ErrorBoundaryMessage error={error} />
    </ErrorBoundaryCard>
  ),
}: {
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => ReactElement | null
}) {
  const error = useRouteError()
  captureRemixErrorBoundaryError(error)
  const params = useParams()

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  return isRouteErrorResponse(error) ?
      (statusHandlers?.[error.status] ?? defaultStatusHandler)({
        error,
        params,
      })
    : unexpectedErrorHandler(error)
}

GeneralErrorBoundary.Card = ErrorBoundaryCard
GeneralErrorBoundary.Title = ErrorBoundaryTitle
GeneralErrorBoundary.Description = ErrorBoundaryDescription
GeneralErrorBoundary.Message = ErrorBoundaryMessage
