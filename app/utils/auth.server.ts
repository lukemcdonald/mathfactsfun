// TODO: Move to app/services/session.server.ts
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { users } from '~/db/schema'

// TODO: Use invariant
// invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    name: 'MF_session',
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    return user
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function verifyLogin(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isValid) return null

  return user
}
