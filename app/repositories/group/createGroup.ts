import { groups } from '~/db/schema';
import { InsertGroup } from '~/db/schemas/groups';
import { Database } from '~/types/misc';

export async function createGroup(db: Database, group: InsertGroup) {
  await db.insert(groups).values({
    id: group.id,
    name: group.name,
    teacherId: group.teacherId
  })
}
