import { Operation } from "~/types/session"

export interface Question {
  answer: number
  num1: number
  num2: number
  operation: Operation
  timeSpent?: number
}
