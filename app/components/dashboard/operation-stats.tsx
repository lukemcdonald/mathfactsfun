import { Link } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { OPERATION } from '~/constants/operations'
import { type OperationStats as OperationStatsType } from '~/types/session'

interface OperationStatsProps {
  stats: Record<string, OperationStatsType>
}

export function OperationStats({ stats }: OperationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Object.entries(stats).map(([operation, operationStats]) => {
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
                <Link to={`/practice/${operation}`}>
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
