import { sql } from 'drizzle-orm'
import { text } from 'drizzle-orm/sqlite-core'

export const timestamps = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  deletedAt: text('deleted_at'),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
}
