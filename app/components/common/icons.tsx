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
  Menu,
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
  AddGroupMember: Plus,
  Book: BookOpen,
  Brain,
  Calculator,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Close: X,
  CloseMenu: X,
  Divide,
  Loader: Loader2,
  Minus,
  Multiply: X,
  OpenMenu: Menu,
  Plus,
  RemoveGroup: X,
  RemoveUser: X,
  School,
  Target,
  TrendingUp,
  Users,
} as const
