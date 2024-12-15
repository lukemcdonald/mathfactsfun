import { Link } from '@remix-run/react'

import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { Progress } from '#app/components/ui/progress'
import { getRoute } from '#app/config/routes'
import { OPERATION } from '#app/constants/operations'
import { type Operation, type OperationStats } from '#app/features/sessions'

interface OperationStatsProps {
  stats: Record<Operation, OperationStats>
}

export function OperationStats({ stats: inStats }: OperationStatsProps) {
  const stats = Object.entries(inStats) as [Operation, OperationStats][]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {stats.map(([operation, operationStats]) => {
        const { accuracy, averageTime, totalSessions } = operationStats
        const Icon = OPERATION[operation as keyof typeof OPERATION].icon
        const name = OPERATION[operation as keyof typeof OPERATION].label

        return (
          <Card key={operation}>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {name}
                </CardTitle>
                <Link to={getRoute.practice.byOperation(operation)}>
                  <Button>Start Practice</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium">{accuracy}%</span>
                </div>
                <Progress value={accuracy} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Time</p>
                  <p className="text-2xl font-bold">{averageTime}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
