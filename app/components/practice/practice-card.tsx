import { Link } from '@remix-run/react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Plus, Minus, X, Divide } from 'lucide-react'

interface PracticeCardProps {
  title: string
  description: string
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
}

const operationIcons = {
  addition: Plus,
  subtraction: Minus,
  multiplication: X,
  division: Divide,
}

export function PracticeCard({
  title,
  description,
  operation,
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
