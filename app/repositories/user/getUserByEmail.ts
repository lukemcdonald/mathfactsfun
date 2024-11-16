import { eq } from 'drizzle-orm'

import { users } from '~/db/schema'
import { Database } from '~/types/misc'

export async function getUserByEmail(db: Database, email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}
