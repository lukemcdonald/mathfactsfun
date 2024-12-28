import { relations, sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { OPERATIONS } from '#app/constants/operations'
import { timestamps } from '#app/db/db.helpers'
import { users } from '#app/db/db.schema'

export const sessions = sqliteTable(
  'sessions',
  {
    averageTime: real('average_time').notNull(),
    completedAt: text('completed_at'),
    correctAnswers: integer('correct_answers').notNull(),
    id: text('id').primaryKey(),
    level: integer('level').notNull(),
    operation: text('operation', { enum: OPERATIONS }).notNull(),
    startedAt: text('started_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    status: text('status', { enum: ['completed', 'cancelled'] })
      .notNull()
      .default('completed'),
    totalQuestions: integer('total_questions').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => ({
    operationIdx: index('sessions_operation_idx').on(table.operation),
    statusIdx: index('sessions_status_idx').on(table.status),
    userIdx: index('sessions_user_idx').on(table.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
