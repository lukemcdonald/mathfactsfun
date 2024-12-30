import type { users } from '#app/features/users/users.db'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type UserRole = User['role']
