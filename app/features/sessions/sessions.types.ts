import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { QuestionResult } from '#app/features/questions'

import { sessions } from './sessions.db'

export type CreateSessionData = Omit<InsertSession, 'completedAt' | 'id' | 'startedAt'> & {
  questionResults: QuestionResult[]
}
export type InsertSession = InferInsertModel<typeof sessions>

export type Operation = SelectSession['operation']

export type OperationStats = {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export type SelectSession = InferSelectModel<typeof sessions>

export type SerializedSession = Omit<SelectSession, 'completedAt' | 'startedAt'> & {
  completedAt: null | string
  startedAt: string
}

export type SessionStats = {
  byOperation: Record<string, OperationStats>
  overall: OperationStats
  recentSessions: Array<SerializedSession>
}
