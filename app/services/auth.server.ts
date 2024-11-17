import { createCookieSessionStorage, redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import invariant from 'tiny-invariant'

import { db } from '~/db'
import { getUserByEmail, getUserById } from '~/repositories/user'

const sessionSecret = process.env.SESSION_SECRET
invariant(sessionSecret, 'SESSION_SECRET must be set')

const USER_SESSION_KEY = 'userId'

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
  session.set(USER_SESSION_KEY, userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return storage.getSession(cookie)
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    return null
  }

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
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return null
    }

    return await getUserById(db, userId)
  } catch (error) {
    const logoutResponse = await logout(request)
    throw logoutResponse
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function verifyLogin(email: string, password: string) {
  const user = await getUserByEmail(db, email)
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isValid) {
    return null
  }

  return user
}
