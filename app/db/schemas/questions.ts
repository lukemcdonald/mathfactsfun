import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { sessions } from '~/db/schema'

export const questions = sqliteTable('questions', {
  correct: integer('correct', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  id: text('id').primaryKey(),
  num1: integer('num1').notNull(),
  num2: integer('num2').notNull(),
  operation: text('operation', {
    enum: ['addition', 'subtraction', 'multiplication', 'division'],
  }).notNull(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  timeSpent: real('time_spent'),
  userAnswer: integer('user_answer'),
})

export const questionsRelations = relations(questions, ({ one }) => ({
  session: one(sessions, {
    fields: [questions.sessionId],
    references: [sessions.id],
  }),
}))

export type InsertQuestion = InferInsertModel<typeof questions>
export type SelectQuestion = InferSelectModel<typeof questions>
