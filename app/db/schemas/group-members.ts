import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { groups, users } from '~/db/schema'

export const groupMembers = sqliteTable(
  'group_members',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    studentId: text('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
