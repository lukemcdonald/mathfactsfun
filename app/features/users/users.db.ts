import { relations } from 'drizzle-orm'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { timestamps } from '#app/db/db.helpers'
import { groupMembers } from '#app/db/db.schema'

export const users = sqliteTable(
  'users',
  {
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role', { enum: ['admin', 'teacher', 'student'] })
      .notNull()
      .default('student'),
    ...timestamps,
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  }),
)

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
}))
