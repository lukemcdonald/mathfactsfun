import { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { subscriptions } from "~/features/subscriptions/subscriptions.api"

export type InsertSubscription = InferInsertModel<typeof subscriptions>
export type SelectSubscription = InferSelectModel<typeof subscriptions>
