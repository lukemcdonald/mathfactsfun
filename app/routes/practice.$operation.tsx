import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Progress } from '~/components/ui/progress'
import { getUser } from '~/services/auth.server'

interface Question {
  answer: number
  num1: number
  num2: number
  operation: string
}

export async function loader({
  params,
  request,
}: {
  params: { operation: string }
  request: Request
}) {
  const user = await getUser(request)
  if (!user) return redirect('/login')

  const validOperations = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
  ]
  if (!validOperations.includes(params.operation)) {
    return redirect('/dashboard/student')
  }

  return json({ operation: params.operation })
}

export default function Practice() {
  const { operation } = useLoaderData<typeof loader>()
  const [currentQuestion, setCurrentQuestion] = useState<null | Question>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [progress, setProgress] = useState(0)
  // const [startTime, setStartTime] = useState<number>(0)
  const [correctAnswers, setCorrectAnswers] = useState<Question[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([])

  const generateQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 13)
    const num2 = Math.floor(Math.random() * 13)
    let answer
    const product = num1 * num2

    switch (operation) {
      case 'addition':
        answer = num1 + num2
        break
      case 'division':
        // Ensure clean division
        answer = num1
        setCurrentQuestion({ answer, num1: product, num2, operation })
        setStartTime(Date.now())
        return
      case 'multiplication':
        answer = num1 * num2
        break
      case 'subtraction':
        answer = num1 - num2
        break
      default:
        answer = 0
    }

    setCurrentQuestion({ answer, num1, num2, operation })
    setStartTime(Date.now())
  }, [operation])

  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentQuestion) return

    // const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer

    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentQuestion])
    } else {
      setWrongAnswers([...wrongAnswers, currentQuestion])
    }

    setProgress(progress + 10)
    setUserAnswer('')

    if (progress < 90) {
      generateQuestion()
    }
  }

  const getOperationSymbol = () => {
    switch (operation) {
      case 'addition':
        return '+'
      case 'division':
        return '÷'
      case 'multiplication':
        return '×'
      case 'subtraction':
        return '-'
      default:
        return ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Progress
          className="mb-8"
          value={progress}
        />

        {progress < 100 ?
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-8 text-center">
                <p className="mb-4 text-4xl font-bold">
                  {currentQuestion?.num1} {getOperationSymbol()}{' '}
                  {currentQuestion?.num2} = ?
                </p>
              </div>

              <Form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <Input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  className="text-center text-2xl"
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  type="number"
                  value={userAnswer}
                />
                <Button
                  className="w-full"
                  type="submit"
                >
                  Submit Answer
                </Button>
              </Form>
            </CardContent>
          </Card>
        : <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold">Practice Complete!</h2>
                <p className="mb-4">
                  Correct: {correctAnswers.length} | Wrong:{' '}
                  {wrongAnswers.length}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Start New Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        }
      </div>
    </div>
  )
}
