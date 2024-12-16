import { relations, sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { OPERATIONS } from '#app/constants/operations'
import { sessions } from '#app/db/schema'

export const questions = sqliteTable(
  'questions',
  {
    correct: integer('correct', { mode: 'boolean' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    id: text('id').primaryKey(),
    num1: integer('num1').notNull(),
    num2: integer('num2').notNull(),
    operation: text('operation', { enum: OPERATIONS }).notNull(),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    timeSpent: real('time_spent'),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    userAnswer: integer('user_answer'),
  },
  (table) => ({
    operationIdx: index('questions_operation_idx').on(table.operation),
    sessionIdx: index('questions_session_idx').on(table.sessionId),
  }),
)

export const questionsRelations = relations(questions, ({ one }) => ({
  session: one(sessions, {
    fields: [questions.sessionId],
    references: [sessions.id],
  }),
}))
