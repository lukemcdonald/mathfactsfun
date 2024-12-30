import { Card } from '#app/components/ui/card'
import { Progress } from '#app/components/ui/progress'
import { calculateSessionAccuracyPercentage } from '#app/features/sessions/sessions.utils'

import type { SerializedSession } from '#app/features/sessions/sessions.types'

interface RecentSessionsProps {
  sessions: Array<SerializedSession>
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No practice sessions yet</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card
          className="p-4"
          key={session.id}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium capitalize">{session.operation} Practice</p>
            <p className="text-sm text-muted-foreground">
              {new Date(session.startedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Accuracy: {calculateSessionAccuracyPercentage(session)}%
            </p>
            <p className="text-sm text-muted-foreground">Time: {session.averageTime}s</p>
          </div>
          <Progress
            className="mt-2 h-2"
            value={calculateSessionAccuracyPercentage(session)}
          />
        </Card>
      ))}
    </div>
  )
}
