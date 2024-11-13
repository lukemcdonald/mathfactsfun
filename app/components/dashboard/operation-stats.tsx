import { Divide, Minus, Plus, X } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'

const operationIcons = {
  addition: Plus,
  division: Divide,
  multiplication: X,
  subtraction: Minus,
}

const operationNames = {
  addition: 'Addition',
  division: 'Division',
  multiplication: 'Multiplication',
  subtraction: 'Subtraction',
}

interface OperationStatsProps {
  stats: Record<
    string,
    {
      accuracy: number
      averageTime: number
      totalSessions: number
    }
  >
}

export function OperationStats({ stats }: OperationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Object.entries(stats).map(
        ([operation, { accuracy, averageTime, totalSessions }]) => {
          const Icon = operationIcons[operation as keyof typeof operationIcons]
          const name = operationNames[operation as keyof typeof operationNames]

          return (
            <Card key={operation}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {name}
                </CardTitle>
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
        },
      )}
    </div>
  )
}
