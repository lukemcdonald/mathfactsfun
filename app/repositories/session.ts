import { Database } from '~/utils/types'

export async function getRecentSessionsByUserId(
  db: Database,
  userId: string,
  limit: number = 5,
) {
  return await db.query.sessions.findMany({
    limit,
    orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
    where: (sessions, { eq }) => eq(sessions.userId, userId),
  })
}
