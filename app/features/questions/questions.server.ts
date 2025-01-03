import { nanoid } from 'nanoid'

import { questions } from '#app/db/db.schema'

import type { NewQuestion, QuestionResult } from '#app/features/questions/questions.types'
import type { Database } from '#app/utils/types'

export async function createQuestions(
  db: Database,
  sessionId: string,
  operation: NewQuestion['operation'],
  questionResults: QuestionResult[],
) {
  const questionData: NewQuestion[] = questionResults.map((q) => ({
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
