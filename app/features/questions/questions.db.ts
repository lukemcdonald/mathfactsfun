import { relations } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { OPERATIONS } from '#app/constants/operations'
import { timestamps } from '#app/db/db.helpers'
import { sessions } from '#app/db/db.schema'

export const questions = sqliteTable(
  'questions',
  {
    correct: integer('correct', { mode: 'boolean' }),
    id: text('id').primaryKey(),
    num1: integer('num1').notNull(),
    num2: integer('num2').notNull(),
    operation: text('operation', { enum: OPERATIONS }).notNull(),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    timeSpent: real('time_spent'),
    userAnswer: integer('user_answer'),
    ...timestamps,
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
