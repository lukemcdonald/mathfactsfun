import { and, eq } from 'drizzle-orm';

import { groupMembers } from '~/db/schema';
import { Database } from '~/types/misc';

export async function getGroupMember(db: Database, groupId: string, studentId: string) {
  return await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.studentId, studentId),
    )
  })
}
