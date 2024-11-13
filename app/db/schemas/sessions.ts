import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { users } from '~/db/schema'

export const sessions = sqliteTable('sessions', {
  averageTime: real('average_time').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  correctAnswers: integer('correct_answers').notNull(),
  id: text('id').primaryKey(),
  level: integer('level').notNull(),
  operation: text('operation', {
    enum: ['addition', 'subtraction', 'multiplication', 'division'],
  }).notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  status: text('status', {
    enum: ['completed', 'cancelled'],
  })
    .notNull()
    .default('completed'),
  totalQuestions: integer('total_questions').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type InsertSession = InferInsertModel<typeof sessions>
export type SelectSession = InferSelectModel<typeof sessions>
