import { users } from '~/db/schema'
import { InsertUser } from '~/db/schemas/users'
import { Database } from '~/types/misc'

export async function createUser(db: Database, user: InsertUser) {
  await db.insert(users).values({
    email: user.email,
    hashedPassword: user.hashedPassword,
    id: user.id,
    name: user.name,
    role: user.role,
  })
}
