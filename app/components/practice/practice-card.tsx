import { Link } from '@remix-run/react'
import { Divide as DivideIcon, Minus as MinusIcon, Plus as PlusIcon, X as XIcon } from 'lucide-react'

import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { Operation } from '#app/features/sessions'

interface PracticeCardProps {
  description: string
  operation: Operation
  title: string
}

const operationIcons = {
  addition: PlusIcon,
  division: DivideIcon,
  multiplication: XIcon,
  subtraction: MinusIcon,
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
        <Link to={`/practice/${operation}`}>
          <Button className="w-full">Start Practice</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
