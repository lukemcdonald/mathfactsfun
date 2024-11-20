import { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { Operation } from "~/features/sessions"

import { questions } from "./questions.db"

export type InsertQuestion = InferInsertModel<typeof questions>
export type SelectQuestion = InferSelectModel<typeof questions>

export interface Question {
  answer: number
  num1: number
  num2: number
  operation: Operation
  timeSpent?: number
}

export type QuestionResult = {
  correct: boolean
  num1: number
  num2: number
  operation: Operation
  timeSpent: number
  userAnswer: number
}
