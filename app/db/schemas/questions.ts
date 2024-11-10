import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

import { sessions } from '~/db/schema'

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  num1: integer('num1').notNull(),
  num2: integer('num2').notNull(),
  operation: text('operation', {
    enum: ['addition', 'subtraction', 'multiplication', 'division'],
  }).notNull(),
  userAnswer: integer('user_answer'),
  correct: integer('correct', { mode: 'boolean' }),
  timeSpent: real('time_spent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const questionsRelations = relations(questions, ({ one }) => ({
  session: one(sessions, {
    fields: [questions.sessionId],
    references: [sessions.id],
  }),
}))

export type InsertQuestion = InferInsertModel<typeof questions>
export type SelectQuestion = InferSelectModel<typeof questions>
