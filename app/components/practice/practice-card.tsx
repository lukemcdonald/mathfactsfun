import { Link } from 'react-router'

import { Icons } from '#app/components/icons'
import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { getRoute } from '#app/config/routes'

import type { Operation } from '#app/features/sessions/sessions.types'

interface PracticeCardProps {
  description: string
  operation: Operation
  title: string
}

const operationIcons = {
  addition: Icons.Plus,
  division: Icons.Divide,
  multiplication: Icons.Multiply,
  subtraction: Icons.Minus,
}

export function PracticeCard({ description, operation, title }: PracticeCardProps) {
  const Icon = operationIcons[operation]

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">{description}</p>
        <Link to={getRoute.practice.byOperation(operation)}>
          <Button className="w-full">Start Practice</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
