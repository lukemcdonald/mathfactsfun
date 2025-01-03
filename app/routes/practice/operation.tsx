import { useCallback, useEffect, useRef, useState } from 'react'
import { redirect, Form, Link, useLoaderData, useNavigate, useSubmit } from 'react-router'

import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#app/components/ui/dialog'
import { Input } from '#app/components/ui/input'
import { Progress } from '#app/components/ui/progress'
import { getRoute } from '#app/config/routes'
import { OPERATION, OPERATIONS } from '#app/constants/operations'
import { db } from '#app/db/db.server'
import { getUser } from '#app/features/auth/auth.server'
import { createQuestions } from '#app/features/questions/questions.server'
import { createSession } from '#app/features/sessions/sessions.server'

import type { QuestionPrompt, QuestionResult } from '#app/features/questions/questions.types'
import type { Operation } from '#app/features/sessions/sessions.types'
import type React from 'react'

import type { Route } from './+types/operation'

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await getUser(request)

  if (!user) {
    return redirect(getRoute.auth.login())
  }

  const { operation } = params as { operation: Operation }

  if (!OPERATIONS.includes(operation)) {
    return redirect(getRoute.dashboard.byRole('student'))
  }

  return {
    operation,
    userId: user.id,
  }
}

export default function Practice() {
  const { operation, userId } = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState<null | QuestionPrompt>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [correctAnswers, setCorrectAnswers] = useState<QuestionResult[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<QuestionResult[]>([])
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [averageTime, setAverageTime] = useState<number>(0)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const generateQuestion = useCallback(() => {
    let answer
    const num1 = Math.floor(Math.random() * 13)
    const num2 = Math.floor(Math.random() * 13)
    const product = num1 * num2

    switch (operation) {
      case 'addition':
        answer = num1 + num2
        break
      case 'division':
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
  }, [generateQuestion, operation, userId])

  // Auto-focus input after each submission
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentQuestion])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press 'r' to restart when practice is complete
      if (e.key === 'r' && progress === 100) {
        window.location.reload()
      }
      // Press 'Escape' to show cancel dialog
      if (e.key === 'Escape' && progress < 100) {
        setShowCancelDialog(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [progress])

  const handleCancel = () => {
    const averageTime =
      questionResults.length > 0 ?
        questionResults.reduce((acc, q) => acc + q.timeSpent, 0) / questionResults.length
      : 0

    const sessionData = {
      averageTime: averageTime,
      correctAnswers: correctAnswers.length,
      operation,
      questionResults,
      totalQuestions: Math.max(questionResults.length, 1),
      userId,
    }

    // Submit session data with cancel intent
    submit(
      {
        intent: 'cancel',
        sessionData: JSON.stringify(sessionData),
      },
      { method: 'post' },
    )

    navigate(getRoute.dashboard.byRole('student'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentQuestion || !userAnswer.trim()) {
      return
    }

    const timeSpent = (Date.now() - startTime) / 1000
    const userAnswerNum = parseInt(userAnswer)
    const isCorrect = userAnswerNum === currentQuestion.answer

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setTimeout(() => setFeedback(null), 500)

    const questionResult: QuestionResult = {
      ...currentQuestion,
      correct: isCorrect,
      timeSpent,
      userAnswer: userAnswerNum,
    }

    setQuestionResults((prev) => [...prev, questionResult])

    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, questionResult])
    } else {
      setWrongAnswers([...wrongAnswers, questionResult])
    }

    setProgress(progress + 10)
    setUserAnswer('')

    if (progress < 90) {
      generateQuestion()
    } else {
      // Calculate session statistics
      const averageTime =
        questionResults.reduce((acc, q) => acc + q.timeSpent, 0) / (questionResults.length + 1)

      setAverageTime(averageTime)

      const sessionData = {
        averageTime,
        correctAnswers: correctAnswers.length + (isCorrect ? 1 : 0),
        operation,
        questionResults: [...questionResults, questionResult],
        totalQuestions: 10,
        userId,
      }

      // Submit session data to the server
      submit(
        {
          intent: 'save',
          sessionData: JSON.stringify(sessionData),
        },
        { method: 'post' },
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow negative numbers and digits
    if (/^-?\d*$/.test(value)) {
      setUserAnswer(value)
    }
  }

  const getOperationSymbol = () => {
    const operationConfig = OPERATION[operation]
    return operationConfig?.operator ?? ''
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Progress
            className="flex-1"
            value={progress}
          />
          <Button
            className="ml-4"
            onClick={() => setShowCancelDialog(true)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>

        {progress < 100 ?
          <Card
            className={`mb-8 transition-colors duration-200 ${
              feedback === 'correct' ? 'bg-green-50'
              : feedback === 'incorrect' ? 'bg-red-50'
              : ''
            }`}
          >
            <CardContent className="pt-6">
              <div className="mb-8 text-center">
                <p className="mb-4 text-4xl font-bold">
                  {currentQuestion?.num1} {getOperationSymbol()} {currentQuestion?.num2} = ?
                </p>
              </div>

              <Form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <Input
                  autoComplete="off"
                  className="text-center text-2xl"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your answer"
                  ref={inputRef}
                  type="text"
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
            <CardHeader>
              <CardTitle className="text-center">Practice Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{correctAnswers.length}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-sm text-muted-foreground">Wrong Answers</p>
                  <p className="mt-1 text-3xl font-bold text-red-600">{wrongAnswers.length}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Average Time per Question</p>
                <p className="mt-1 text-3xl font-bold">{Math.round(averageTime)}s</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Link
                  className="w-full"
                  to={getRoute.dashboard.byRole('student')}
                >
                  <Button className="w-full">Back to Dashboard</Button>
                </Link>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {`Press "R" to start a new practice session`}
              </p>
            </CardContent>
          </Card>
        }
      </div>

      <Dialog
        onOpenChange={setShowCancelDialog}
        open={showCancelDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Practice Session?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this practice session? Your progress will be saved as
              a cancelled session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowCancelDialog(false)}
              variant="outline"
            >
              Continue Practice
            </Button>
            <Button
              onClick={handleCancel}
              variant="destructive"
            >
              Cancel Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export async function action({ request }: Route.ActionArgs) {
  const user = await getUser(request)

  if (!user) {
    return redirect(getRoute.auth.login())
  }

  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === 'save' || intent === 'cancel') {
    const sessionData = formData.get('sessionData')

    if (typeof sessionData !== 'string') {
      throw new Response('Invalid session data', { status: 400 })
    }

    const { averageTime, correctAnswers, operation, questionResults, totalQuestions } =
      JSON.parse(sessionData)

    // Create session and get its ID
    const sessionId = await createSession(db, {
      averageTime,
      correctAnswers,
      level: 1,
      operation,
      questionResults,
      status: intent === 'cancel' ? 'cancelled' : 'completed',
      totalQuestions,
      userId: user.id,
    })

    // Create associated questions
    await createQuestions(db, sessionId, operation, questionResults)

    return { success: true }
  }

  return null
}
