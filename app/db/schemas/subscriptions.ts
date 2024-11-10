import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import { users } from '~/db/schema'

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan', { enum: ['free', 'premium'] }).notNull(),
  status: text('status', {
    enum: ['active', 'cancelled', 'expired'],
  }).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  endDate: integer('end_date', { mode: 'timestamp' }),
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

export type InsertSubscription = InferInsertModel<typeof subscriptions>
export type SelectSubscription = InferSelectModel<typeof subscriptions>
