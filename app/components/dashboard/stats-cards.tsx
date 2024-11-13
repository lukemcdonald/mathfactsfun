import { Brain, Clock, Target } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface StatsCardsProps {
  accuracy: number
  averageTime: number
  totalSessions: number
}

export function StatsCards({
  accuracy,
  averageTime,
  totalSessions,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Total Practice Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Overall Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{accuracy}%</p>
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
          <p className="text-3xl font-bold">{averageTime}s</p>
        </CardContent>
      </Card>
    </div>
  )
}
