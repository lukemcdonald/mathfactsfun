import type { subscriptions } from '#app/features/subscriptions/subscriptions.db'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type InsertSubscription = InferInsertModel<typeof subscriptions>
export type SelectSubscription = InferSelectModel<typeof subscriptions>
