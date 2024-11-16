import { nanoid } from 'nanoid'

import { sessions } from '~/db/schema'
import { Database } from '~/types/misc'
import { CreateSessionData } from '~/types/session'

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
