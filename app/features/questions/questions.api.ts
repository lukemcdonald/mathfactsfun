import { nanoid } from 'nanoid'

import { questions } from '#app/db/schema'
import { type InsertQuestion, type QuestionResult } from '#app/features/questions'
import { Database } from '#app/utils/types'

export async function createQuestions(
  db: Database,
  sessionId: string,
  operation: InsertQuestion['operation'],
  questionResults: QuestionResult[],
) {
  const questionData: InsertQuestion[] = questionResults.map((q) => ({
    correct: q.correct,
    id: nanoid(),
    num1: q.num1,
    num2: q.num2,
    operation,
    sessionId,
    timeSpent: q.timeSpent,
    userAnswer: q.userAnswer,
  }))

  await db.insert(questions).values(questionData)
}
