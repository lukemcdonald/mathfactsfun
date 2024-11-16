import { Database } from '~/types/misc'
import { SerializedSession } from '~/types/session'
import { formatDate } from '~/utils/date'

export async function getRecentSessionsByUserId(
  db: Database,
  userId: string,
  limit: number = 5,
): Promise<Array<SerializedSession>> {
  const results = await db.query.sessions.findMany({
    limit,
    orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
    where: (sessions, { eq }) => eq(sessions.userId, userId),
  })

  return results.map(session => ({
    ...session,
    completedAt: formatDate(
      typeof session.completedAt === 'number' ? session.completedAt : null,
      new Date().toISOString()
    ),
    startedAt: formatDate(
      typeof session.startedAt === 'number' ? session.startedAt : null,
      new Date().toISOString()
    ),
  }))
}
