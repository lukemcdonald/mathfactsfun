import { eq } from 'drizzle-orm';

import { groups } from '~/db/schema';
import { InsertGroup } from '~/db/schemas/groups';
import { Database } from '~/utils/types';


export async function createGroup(db: Database, group: InsertGroup) {
  await db.insert(groups).values({
    id: group.id,
    name: group.name,
    teacherId: group.teacherId
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
  });
}

// export async function getGroupsByTeacherIdAlt(db: Database, teacherId: string) {
//   return await db.select()
//     .from(groups)
//     .where(eq(groups.teacherId, teacherId));
// }
