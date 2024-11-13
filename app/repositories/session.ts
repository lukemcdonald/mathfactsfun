import { eq } from 'drizzle-orm'

import { sessions } from '~/db/schema'
import { Database } from '~/utils/types'

export type OperationStats = {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export type SessionStats = {
  byOperation: Record<string, OperationStats>
  overall: {
    accuracy: number
    averageTime: number
    totalSessions: number
  }
  recentSessions: Awaited<ReturnType<typeof getRecentSessionsByUserId>>
}

function formatDate(timestamp: null | number): null | string {
  if (!timestamp) return null

  try {
    // Ensure timestamp is a valid number and convert to milliseconds if needed
    const ms = timestamp > 1e10 ? timestamp : timestamp * 1000
    return new Date(ms).toISOString()
  } catch (error) {
    console.error('Invalid timestamp:', timestamp)
    return null
  }
}

export async function getRecentSessionsByUserId(
  db: Database,
  userId: string,
  limit: number = 5,
) {
  const results = await db.query.sessions.findMany({
    limit,
    orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
    where: (sessions, { eq }) => eq(sessions.userId, userId),
  })

  // Ensure dates are properly serialized
  return results.map(session => ({
    ...session,
    completedAt: formatDate(session.completedAt),
    // Fallback to current time if startedAt is invalid
    startedAt: formatDate(session.startedAt) ?? new Date().toISOString(),
  }))
}

export async function getStudentStats(db: Database, userId: string): Promise<SessionStats> {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
  })

  const recentSessions = await getRecentSessionsByUserId(db, userId)

  // Initialize stats for each operation
  const operations = ['addition', 'subtraction', 'multiplication', 'division']
  const byOperation: Record<string, OperationStats> = {}

  operations.forEach((op) => {
    const opSessions = allSessions.filter((s) => s.operation === op)
    const totalSessions = opSessions.length

    byOperation[op] = {
      accuracy: totalSessions === 0 ? 0 : Math.round(
        (opSessions.reduce(
          (acc, session) => acc + (session.correctAnswers / session.totalQuestions),
          0,
        ) / totalSessions) * 100,
      ),
      averageTime: totalSessions === 0 ? 0 : Math.round(
        opSessions.reduce((acc, session) => acc + session.averageTime, 0) / totalSessions,
      ),
      totalSessions,
    }
  })

  // Calculate overall stats
  const totalSessions = allSessions.length
  const overall = {
    accuracy: totalSessions === 0 ? 0 : Math.round(
      (allSessions.reduce(
        (acc, session) => acc + (session.correctAnswers / session.totalQuestions),
        0,
      ) / totalSessions) * 100,
    ),
    averageTime: totalSessions === 0 ? 0 : Math.round(
      allSessions.reduce((acc, session) => acc + session.averageTime, 0) / totalSessions,
    ),
    totalSessions,
  }

  return {
    byOperation,
    overall,
    recentSessions,
  }
}
