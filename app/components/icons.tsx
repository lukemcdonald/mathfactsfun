import {
  BookOpen,
  Brain,
  Calculator,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Divide,
  Loader2,
  Minus,
  Plus,
  School,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export type IconComponent = LucideIcon

export const Icons = {
  Book: BookOpen,
  Brain,
  Calculator,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Close: X,
  Divide,
  Loader: Loader2,
  Minus,
  Multiply: X,
  Plus,
  School,
  Target,
  TrendingUp,
  Users,
} as const
