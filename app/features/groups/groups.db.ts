import { relations } from 'drizzle-orm'
import { index, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

import { timestamps } from '#app/db/db.helpers'
import { users } from '#app/db/db.schema'

export const groups = sqliteTable(
  'groups',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    teacherId: text('teacher_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => ({
    nameIdx: index('name_idx').on(table.name),
    teacherIdx: index('teacher_idx').on(table.teacherId),
  }),
)

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
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    id: text('id').primaryKey(),
    studentId: text('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => ({
    groupIdx: index('group_idx').on(table.groupId),
    groupStudentUnique: unique('group_student_unique').on(table.groupId, table.studentId),
    studentIdx: index('student_idx').on(table.studentId),
  }),
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
