import { Link } from '@remix-run/react'
import { Divide, Minus, Plus, X } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface PracticeCardProps {
  description: string
  operation: 'addition' | 'division' | 'multiplication' | 'subtraction'
  title: string
}

const operationIcons = {
  addition: Plus,
  division: Divide,
  multiplication: X,
  subtraction: Minus,
}

export function PracticeCard({
  description,
  operation,
  title,
}: PracticeCardProps) {
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
        <Link to={`/practice/${operation}`}>
          <Button className="w-full">Start Practice</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
