import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { users } from '#app/db/schema'

export const groups = sqliteTable('groups', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  teacherId: text('teacher_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const groupsRelations = relations(groups, ({ many, one }) => ({
  groupMembers: many(groupMembers),
  teacher: one(users, {
    fields: [groups.teacherId],
    references: [users.id],
  }),
}))

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
