import { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { QuestionResult } from '~/features/questions'

import { sessions } from "./sessions.db"

export type InsertSession = InferInsertModel<typeof sessions>
export type SelectSession = InferSelectModel<typeof sessions>

export type CreateSessionData = {
  questionResults: QuestionResult[];
} & Omit<InsertSession, 'completedAt' | 'id' | 'startedAt'>

export type Operation = SelectSession['operation'];

export type OperationStats = {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export type SerializedSession = {
  completedAt: null | string
  startedAt: string
} & Omit<SelectSession, 'completedAt' | 'startedAt'>

export type SessionStats = {
  byOperation: Record<string, OperationStats>
  overall: OperationStats
  recentSessions: Array<SerializedSession>
}
