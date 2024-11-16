import { nanoid } from 'nanoid'

import { questions } from '~/db/schema'
import { InsertQuestion } from '~/db/schemas/questions'
import { Database } from '~/types/misc'
import { QuestionResult } from '~/types/session'

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
