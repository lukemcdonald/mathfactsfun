import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { groupMembers } from '~/db/schema'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'teacher', 'student'] })
    .notNull()
    .default('student'),
  hashedPassword: text('hashed_password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
}))

export type InsertUser = InferInsertModel<typeof users>
export type SelectUser = InferSelectModel<typeof users>
