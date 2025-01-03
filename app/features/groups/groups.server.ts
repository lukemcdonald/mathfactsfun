import { and, eq } from 'drizzle-orm'

import { groupMembers, groups } from '#app/db/db.schema'

import type { Database } from '#app/utils/types'

import type { NewGroup, NewGroupMember } from './groups.types'

export async function addGroupMember(db: Database, groupMember: NewGroupMember) {
  await db.insert(groupMembers).values({
    groupId: groupMember.groupId,
    id: groupMember.id,
    studentId: groupMember.studentId,
  })
}

export async function createGroup(db: Database, group: NewGroup) {
  await db.insert(groups).values({
    id: group.id,
    name: group.name,
    teacherId: group.teacherId,
  })
}

export async function getGroupMember(db: Database, groupId: string, studentId: string) {
  return await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.studentId, studentId)),
  })
}

export async function getGroupsByTeacherId(db: Database, teacherId: string) {
  return await db.query.groups.findMany({
    where: eq(groups.teacherId, teacherId),
    with: {
      groupMembers: {
        with: {
          student: true,
        },
      },
    },
  })
}

export async function removeGroupMember(db: Database, groupId: string, studentId: string) {
  return db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.studentId, studentId)))
}

export async function removeGroup(db: Database, groupId: string) {
  return db.delete(groups).where(eq(groups.id, groupId))
}
