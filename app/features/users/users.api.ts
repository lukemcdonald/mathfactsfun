import { eq } from 'drizzle-orm'

import { users } from '#app/db/schema'
import { InsertUser } from '#app/features/users/users.types'
import { Database } from '#app/utils/types'

export async function createUser(db: Database, user: InsertUser) {
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
