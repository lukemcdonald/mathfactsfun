import { sql, relations, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { groupMembers, users } from '~/db/schema'

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  teacherId: text('teacher_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const groupsRelations = relations(groups, ({ many, one }) => ({
  groupMembers: many(groupMembers),
  teacher: one(users, {
    fields: [groups.teacherId],
    references: [users.id],
  }),
}))

export type InsertGroup = InferInsertModel<typeof groups>
export type SelectGroup = InferSelectModel<typeof groups>
