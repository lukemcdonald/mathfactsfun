import { desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { OPERATIONS } from '#app/constants/operations'

import { sessions } from './sessions.db'
import { calculateAverageAccuracy, calculateAverageTime, formatDate } from './sessions.utils'

import type {
  SerializedSession,
  CreateSessionData,
  OperationStats,
  SessionStats,
} from '#app/features/sessions/sessions.types'
import type { Database } from '#app/utils/types'

export async function createSession(db: Database, data: CreateSessionData) {
  const sessionId = nanoid()

  await db.insert(sessions).values({
    averageTime: data.averageTime,
    correctAnswers: data.correctAnswers,
    id: sessionId,
    level: data.level || 1,
    operation: data.operation,
    status: data.status,
    totalQuestions: data.totalQuestions,
    userId: data.userId,
  })

  return sessionId
}

export async function getRecentSessionsByUserId(
  db: Database,
  userId: string,
  limit: number = 5,
): Promise<Array<SerializedSession>> {
  const results = await db.query.sessions.findMany({
    limit,
    orderBy: [desc(sessions.startedAt)],
    where: eq(sessions.userId, userId),
  })

  return results.map((session) => ({
    ...session,
    completedAt: formatDate(
      typeof session.completedAt === 'number' ? session.completedAt : null,
      new Date().toISOString(),
    ),
    startedAt: formatDate(
      typeof session.startedAt === 'number' ? session.startedAt : null,
      new Date().toISOString(),
    ),
  }))
}

export async function getStudentProgress(db: Database, userId: string) {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
  })

  const recentSessions = await getRecentSessionsByUserId(db, userId, 5)
  const totalSessions = allSessions.length

  const averageAccuracy = calculateAverageAccuracy(allSessions)
  const averageTime = calculateAverageTime(allSessions)

  return {
    averageAccuracy,
    averageTime,
    recentSessions,
    totalSessions,
  }
}

export async function getStudentStats(db: Database, userId: string): Promise<SessionStats> {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
  })

  const recentSessions = await getRecentSessionsByUserId(db, userId)

  // Initialize stats for each operation
  const byOperation: Record<string, OperationStats> = {}

  OPERATIONS.forEach((op) => {
    const opSessions = allSessions.filter((s) => s.operation === op)

    byOperation[op] = {
      accuracy: calculateAverageAccuracy(opSessions),
      averageTime: calculateAverageTime(opSessions),
      totalSessions: opSessions.length,
    }
  })

  // Calculate overall stats
  const overall = {
    accuracy: calculateAverageAccuracy(allSessions),
    averageTime: calculateAverageTime(allSessions),
    totalSessions: allSessions.length,
  }

  return {
    byOperation,
    overall,
    recentSessions,
  }
}
