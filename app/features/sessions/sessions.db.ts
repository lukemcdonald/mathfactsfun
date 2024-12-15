import { relations, sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { OPERATIONS } from '#app/constants/operations'
import { users } from '#app/db/schema'

export const sessions = sqliteTable(
  'sessions',
  {
    averageTime: real('average_time').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    correctAnswers: integer('correct_answers').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    id: text('id').primaryKey(),
    level: integer('level').notNull(),
    operation: text('operation', { enum: OPERATIONS }).notNull(),
    startedAt: integer('started_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    status: text('status', { enum: ['completed', 'cancelled'] })
      .notNull()
      .default('completed'),
    totalQuestions: integer('total_questions').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('operation_idx').on(table.operation),
    index('status_idx').on(table.status),
    index('user_idx').on(table.userId),
  ],
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
