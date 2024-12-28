import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { timestamps } from '#app/db/db.helpers'
import { users } from '#app/db/db.schema'

export const subscriptions = sqliteTable('subscriptions', {
  endDate: text('end_date'),
  id: text('id').primaryKey(),
  plan: text('plan', { enum: ['free', 'premium'] }).notNull(),
  startDate: text('start_date')
    .notNull()
    .default(sql`(current_timestamp)`),
  status: text('status', {
    enum: ['active', 'cancelled', 'expired'],
  }).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))
