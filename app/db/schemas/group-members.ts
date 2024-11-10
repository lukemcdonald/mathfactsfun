import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { groups, users } from '~/db/schema'

export const groupMembers = sqliteTable(
  'group_members',
  {
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    id: text('id').primaryKey(),
    studentId: text('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  // (table) => ({
  //   pk: primaryKey({
  //     columns: [table.groupId, table.studentId],
  //   }),
  // }),
)

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  student: one(users, {
    fields: [groupMembers.studentId],
    references: [users.id],
  }),
}))

export type InsertGroupMember = InferInsertModel<typeof groupMembers>
export type SelectGroupMember = InferSelectModel<typeof groupMembers>
