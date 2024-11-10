import { eq } from 'drizzle-orm'

import { users } from '~/db/schema'
import { InsertUser } from '~/db/schemas/users'
import { Database } from '~/utils/types'

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

export function getUserById(db: Database, userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}
