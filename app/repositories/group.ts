import { Database } from '~/utils/types'

export async function getGroupsByTeacherId(db: Database, teacherId: string) {
  return await db.query.groups.findMany({
    where: (groups, { eq }) => eq(groups.teacherId, teacherId),
    with: {
      groupMembers: {
        with: {
          student: true,
        },
      },
    },
  })
}
