import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { groupMembers, groups } from './groups.db'

export type InsertGroup = InferInsertModel<typeof groups>
export type SelectGroup = InferSelectModel<typeof groups>
export type InsertGroupMember = InferInsertModel<typeof groupMembers>
export type SelectGroupMember = InferSelectModel<typeof groupMembers>
