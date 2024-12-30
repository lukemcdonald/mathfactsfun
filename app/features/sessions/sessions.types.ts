import type { QuestionResult } from '#app/features/questions/questions.types'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { sessions } from './sessions.db'

export type Session = InferSelectModel<typeof sessions>
export type NewSession = InferInsertModel<typeof sessions>

export type CreateSessionData = Omit<NewSession, 'completedAt' | 'id' | 'startedAt'> & {
  questionResults: QuestionResult[]
}

export type Operation = Session['operation']

export type OperationStats = {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export type SessionStats = {
  byOperation: Record<Operation, OperationStats>
  overall: OperationStats
  recentSessions: Array<SerializedSession>
}

export type SerializedSession = Omit<Session, 'completedAt' | 'startedAt'> & {
  completedAt: null | string
  startedAt: string
}
