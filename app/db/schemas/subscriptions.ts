import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { users } from '~/db/schema'

export const subscriptions = sqliteTable('subscriptions', {
  endDate: integer('end_date', { mode: 'timestamp' }),
  id: text('id').primaryKey(),
  plan: text('plan', { enum: ['free', 'premium'] }).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  status: text('status', {
    enum: ['active', 'cancelled', 'expired'],
  }).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

export type InsertSubscription = InferInsertModel<typeof subscriptions>
export type SelectSubscription = InferSelectModel<typeof subscriptions>
