import type { User } from '#app/features/users/users.types'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { groupMembers, groups } from './groups.db'

export type Group = InferSelectModel<typeof groups>
export type NewGroup = InferInsertModel<typeof groups>
export type GroupMember = InferSelectModel<typeof groupMembers>
export type NewGroupMember = InferInsertModel<typeof groupMembers>

export type GroupWithMembers = Pick<Group, 'id' | 'name'> & {
  groupMembers: GroupMember[]
}

export type GroupWithStudentMembers = Pick<Group, 'id' | 'name'> & {
  groupMembers: { student: User }[]
}
