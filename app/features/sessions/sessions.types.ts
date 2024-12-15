import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { QuestionResult } from '#app/features/questions'

import { sessions } from './sessions.db'

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
  byOperation: Record<string, OperationStats>
  overall: OperationStats
  recentSessions: Array<Session>
}

export type SerializedSession = Omit<Session, 'completedAt' | 'startedAt'> & {
  completedAt: null | string
  startedAt: string
}
