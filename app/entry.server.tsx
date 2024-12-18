import 'dotenv/config'

/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import { renderToPipeableStream } from 'react-dom/server'

import type { AppLoadContext, EntryContext } from '@remix-run/node'

import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import * as Sentry from '@sentry/remix'
import { isbot } from 'isbot'
import { PassThrough } from 'node:stream'

const ABORT_DELAY = 5_000

export const handleError = Sentry.wrapHandleErrorWithSentry(
  (error: unknown, args: { request: unknown }) => {
    console.error('Server error:', error)

    const request = args.request as Request
    const url = new URL(request.url)

    // Report to Sentry with enhanced context
    Sentry.captureException(error, {
      extra: {
        headers: Object.fromEntries(request.headers),
        query: Object.fromEntries(url.searchParams),
      },
      tags: {
        host: url.host,
        method: request.method,
        pathname: url.pathname,
      },
    })

    // Return response based on client type
    if (isbot(request.headers.get('user-agent'))) {
      throw new Response('Internal Server Error', { status: 500 })
    }

    throw new Response('Internal Server Error', {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    })
  },
)

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  return isbot(request.headers.get('user-agent') || '') ?
      handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext)
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { abort, pipe } = renderToPipeableStream(
      <RemixServer
        abortDelay={ABORT_DELAY}
        context={remixContext}
        url={request.url}
      />,
      {
        onAllReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { abort, pipe } = renderToPipeableStream(
      <RemixServer
        abortDelay={ABORT_DELAY}
        context={remixContext}
        url={request.url}
      />,
      {
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
