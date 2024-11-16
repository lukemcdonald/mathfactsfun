import { InsertSession, SelectSession } from '~/db/schemas/sessions'

export type OperationStats = {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export type Operation = SelectSession['operation'];

export type QuestionResult = {
  correct: boolean
  num1: number
  num2: number
  operation: Operation
  timeSpent: number
  userAnswer: number
}

export type CreateSessionData = {
  questionResults: QuestionResult[];
} & Omit<InsertSession, 'completedAt' | 'id' | 'startedAt'>

export type SerializedSession = {
  completedAt: null | string
  startedAt: string
} & Omit<SelectSession, 'completedAt' | 'startedAt'>

export type SessionStats = {
  byOperation: Record<string, OperationStats>
  overall: OperationStats
  recentSessions: Array<SerializedSession>
}
