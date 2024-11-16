import { and, eq } from 'drizzle-orm';

import { groupMembers } from '~/db/schema';
import { InsertGroupMember } from '~/db/schemas/group-members';
import { Database } from '~/utils/types';

export async function addGroupMember(db: Database, groupMember: InsertGroupMember) {
  await db.insert(groupMembers).values({
    groupId: groupMember.groupId,
    id: groupMember.id,
    studentId: groupMember.studentId
  })
}

export async function getGroupMember(db: Database, groupId: string, studentId: string) {
  return await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.studentId, studentId),
    )
  })
}
