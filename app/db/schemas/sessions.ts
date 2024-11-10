import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

import { users } from '~/db/schema'

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  operation: text('operation', {
    enum: ['addition', 'subtraction', 'multiplication', 'division'],
  }).notNull(),
  level: integer('level').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  averageTime: real('average_time').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type InsertSession = InferInsertModel<typeof sessions>
export type SelectSession = InferSelectModel<typeof sessions>
