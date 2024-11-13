import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Brain, Clock, Target } from 'lucide-react'

import { PracticeCard } from '~/components/practice/practice-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { db } from '~/db'
import { getRecentSessionsByUserId } from '~/repositories/session'
import { getUser } from '~/services/auth.server'

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }

  if (user.role !== 'student') {
    return redirect('/dashboard/teacher')
  }

  const recentSessions = await getRecentSessionsByUserId(db, user.id, 5)

  return json({ recentSessions, user })
}

export default function StudentDashboard() {
  const { recentSessions, user } = useLoaderData<typeof loader>()

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
          description="Practice addition with numbers 0-12"
          operation="addition"
          title="Addition"
        />
        <PracticeCard
          description="Practice subtraction with numbers 0-12"
          operation="subtraction"
          title="Subtraction"
        />
        <PracticeCard
          description="Practice multiplication with numbers 0-12"
          operation="multiplication"
          title="Multiplication"
        />
        <PracticeCard
          description="Practice division with numbers 0-12"
          operation="division"
          title="Division"
        />
      </div>
    </div>
  )
}
