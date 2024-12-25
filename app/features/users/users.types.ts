import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { users } from '#app/features/users/users.db.server'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type UserRole = User['role']
