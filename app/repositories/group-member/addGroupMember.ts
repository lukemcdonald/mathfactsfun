import { groupMembers } from '~/db/schema';
import { InsertGroupMember } from '~/db/schemas/group-members';
import { Database } from '~/types/misc';

export async function addGroupMember(db: Database, groupMember: InsertGroupMember) {
  await db.insert(groupMembers).values({
    groupId: groupMember.groupId,
    id: groupMember.id,
    studentId: groupMember.studentId
  })
}
