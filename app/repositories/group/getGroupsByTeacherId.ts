import { eq } from 'drizzle-orm';

import { groups } from '~/db/schema';
import { Database } from '~/types/misc';

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
