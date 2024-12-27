import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { groupMembers } from '#app/db/db.schema.server.js'

export const users = sqliteTable(
  'users',
  {
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role', { enum: ['admin', 'teacher', 'student'] })
      .notNull()
      .default('student'),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  }),
)

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
}))
