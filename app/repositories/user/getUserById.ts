import { eq } from 'drizzle-orm'

import { users } from '~/db/schema'
import { Database } from '~/types/misc'

export async function getUserById(db: Database, userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}
