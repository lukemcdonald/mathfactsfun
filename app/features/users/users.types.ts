import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { users } from '#app/features/users/users.db'

export type InsertUser = InferInsertModel<typeof users>
export type SelectUser = InferSelectModel<typeof users>

export type UserRole = SelectUser['role']
