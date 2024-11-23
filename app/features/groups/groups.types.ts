import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { SelectUser } from '#app/features/users/users.types.js'

import { groupMembers, groups } from './groups.db'

export type InsertGroup = InferInsertModel<typeof groups>
export type InsertGroupMember = InferInsertModel<typeof groupMembers>
export type SelectGroup = InferSelectModel<typeof groups>
export type SelectGroupMember = InferSelectModel<typeof groupMembers>

export type GroupWithMembers = Pick<SelectGroup, 'id' | 'name'> & {
  groupMembers: SelectGroupMember[]
}
export type GroupWithStudentMembers = Pick<SelectGroup, 'id' | 'name'> & {
  groupMembers: { student: SelectUser }[]
}
