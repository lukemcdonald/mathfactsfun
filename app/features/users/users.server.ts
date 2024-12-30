import { eq } from 'drizzle-orm'

import { users } from '#app/db/db.schema'

import type { NewUser } from '#app/features/users/users.types'
import type { Database } from '#app/utils/types'

export async function createUser(db: Database, user: NewUser) {
  await db.insert(users).values({
    email: user.email,
    hashedPassword: user.hashedPassword,
    id: user.id,
    name: user.name,
    role: user.role,
  })
}

export async function getUserByEmail(db: Database, email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function getUserById(db: Database, userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}

export async function deleteUser(db: Database, userId: string) {
  return db.delete(users).where(eq(users.id, userId)).execute()
}

export async function updateUser(db: Database, userId: string, user: Partial<NewUser>) {
  return db.update(users).set(user).where(eq(users.id, userId)).execute()
}
