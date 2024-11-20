import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { groupMembers } from '~/db/schema'

export const users = sqliteTable('users', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'teacher', 'student'] })
    .notNull()
    .default('student'),
})

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
}))
