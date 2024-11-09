'use client'

import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { db } from '~/db'
import { sessions } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Brain, Clock, Target } from 'lucide-react'
import { PracticeCard } from '~/components/practice/practice-card'

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  if (!user) return redirect('/login')
  if (user.role !== 'student') return redirect('/dashboard/teacher')

  const recentSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, user.id),
    orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
    limit: 5,
  })

  return { user, recentSessions }
}

export default function StudentDashboard() {
  const { user, recentSessions } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Welcome back, {user.name}!</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Total Practice Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentSessions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Accuracy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {recentSessions.length > 0 ?
                Math.round(
                  (recentSessions.reduce(
                    (acc, session) =>
                      acc + session.correctAnswers / session.totalQuestions,
                    0,
                  ) /
                    recentSessions.length) *
                    100,
                )
              : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {recentSessions.length > 0 ?
                Math.round(
                  recentSessions.reduce(
                    (acc, session) => acc + session.averageTime,
                    0,
                  ) / recentSessions.length,
                )
              : 0}
              s
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PracticeCard
          title="Addition"
          description="Practice addition with numbers 0-12"
          operation="addition"
        />
        <PracticeCard
          title="Subtraction"
          description="Practice subtraction with numbers 0-12"
          operation="subtraction"
        />
        <PracticeCard
          title="Multiplication"
          description="Practice multiplication with numbers 0-12"
          operation="multiplication"
        />
        <PracticeCard
          title="Division"
          description="Practice division with numbers 0-12"
          operation="division"
        />
      </div>
    </div>
  )
}
