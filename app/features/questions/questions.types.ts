import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { Operation } from '#app/features/sessions/sessions.types'

import { questions } from './questions.db'

export type Question = InferSelectModel<typeof questions>
export type NewQuestion = InferInsertModel<typeof questions>

// Domain model for a question
export interface QuestionPrompt {
  answer: number
  num1: number
  num2: number
  operation: Operation
  timeSpent?: number
}

// Result of a completed question
export type QuestionResult = {
  correct: boolean
  num1: number
  num2: number
  operation: Operation
  timeSpent: number
  userAnswer: number
}
