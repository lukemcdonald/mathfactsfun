import { eq } from 'drizzle-orm'

import { sessions } from '~/db/schema'
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

export async function getStudentProgress(db: Database, studentId: string) {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, studentId),
  })

  const recentSessions = allSessions
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5)

  const totalSessions = allSessions.length

  // Calculate averages
  const averageAccuracy =
    totalSessions === 0 ?
      0
      : Math.round(
        (allSessions.reduce(
          (acc, session) =>
            acc + session.correctAnswers / session.totalQuestions,
          0,
        ) /
          totalSessions) *
        100,
      )

  const averageTime =
    totalSessions === 0 ?
      0
      : Math.round(
        allSessions.reduce((acc, session) => acc + session.averageTime, 0) /
        totalSessions,
      )

  return {
    averageAccuracy,
    averageTime,
    recentSessions,
    totalSessions,
  }
}
