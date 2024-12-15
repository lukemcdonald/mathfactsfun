import {
  Clock as ClockIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#app/components/ui/dialog'
import { Progress } from '#app/components/ui/progress'
import { SerializedSession } from '#app/features/sessions'

interface ViewProgressDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  studentName: string
  studentProgress: {
    averageAccuracy: number
    averageTime: number
    recentSessions: SerializedSession[]
    totalSessions: number
  }
}

export function ViewProgressDialog({
  onOpenChange,
  open,
  studentName,
  studentProgress,
}: ViewProgressDialogProps) {
  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Progress for {studentName}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border p-4">
              <TargetIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Accuracy</p>
                <p className="text-2xl font-bold">{studentProgress.averageAccuracy}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border p-4">
              <ClockIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Time</p>
                <p className="text-2xl font-bold">{studentProgress.averageTime}s</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border p-4">
              <TrendingUpIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{studentProgress.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Sessions</h3>
            {studentProgress.recentSessions.map((session) => (
              <div
                className="space-y-2 rounded-lg border p-4"
                key={session.id}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium capitalize">{session.operation} Practice</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.startedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Accuracy: {Math.round((session.correctAnswers / session.totalQuestions) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Time: {session.averageTime}s</p>
                </div>
                <Progress
                  className="h-2"
                  value={(session.correctAnswers / session.totalQuestions) * 100}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
