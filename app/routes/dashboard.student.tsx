import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { OperationStats } from '#app/components/dashboard/operation-stats'
import { RecentSessions } from '#app/components/dashboard/recent-sessions'
import { StatsCards } from '#app/components/dashboard/stats-cards'
import { db } from '#app/db'
import { getUser } from '#app/features/auth/auth.api'
import { getStudentStats } from '#app/features/sessions'

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }

  if (user.role !== 'student') {
    return redirect('/dashboard/teacher')
  }

  const stats = await getStudentStats(db, user.id)

  return json({ stats, user })
}

export default function StudentDashboard() {
  const { stats, user } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Welcome back, {user.name}!</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Overall Progress</h2>
        <StatsCards
          accuracy={stats.overall.accuracy}
          averageTime={stats.overall.averageTime}
          totalSessions={stats.overall.totalSessions}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Progress by Operation</h2>
        <OperationStats stats={stats.byOperation} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Sessions</h2>
        <RecentSessions sessions={stats.recentSessions} />
      </div>
    </div>
  )
}
