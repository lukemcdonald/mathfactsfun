import { Database } from '~/utils/types'

export async function getUserByEmail(db: Database, email: string) {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export function getUserById(db: Database, userId: string) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
}
