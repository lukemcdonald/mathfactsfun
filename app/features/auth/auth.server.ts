import { createCookieSessionStorage, redirect } from 'react-router'

import bcrypt from 'bcryptjs'
import invariant from 'tiny-invariant'

import { db } from '#app/db/db.server'
import { getUserByEmail, getUserById } from '#app/features/users/users.server'
import { getErrorMessage } from '#app/utils/errors'

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

export async function getUser(request: Request) {
  try {
    const userId = await getUserId(request)

    if (!userId) {
      return null
    }
    const user = await getUserById(db, userId)

    // Serialize dates before returning the user
    if (user) {
      return {
        ...user,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
    return null
  } catch (error) {
    const logoutResponse = await logout(request)
    console.error('Error getting user:', getErrorMessage(error))
    throw logoutResponse
  }
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'string') {
    return null
  }

  return userId
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return storage.getSession(cookie)
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
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

export async function verifyLogin(email: string, password: string) {
  const user = await getUserByEmail(db, email)
  if (!user) {
    return null
  }

  // eslint-disable-next-line import/no-named-as-default-member
  const isValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isValid) {
    return null
  }

  return user
}
