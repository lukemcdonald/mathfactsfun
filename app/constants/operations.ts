import {
  Plus as AddIcon,
  Divide as DivideIcon,
  X as MultiplyIcon,
  Minus as SubtractIcon,
} from 'lucide-react'

export const OPERATION = {
  addition: {
    actionLabel: 'Add',
    icon: AddIcon,
    label: 'Addition',
    operator: '+',
    value: 'addition',
  },
  division: {
    actionLabel: 'Divide',
    icon: DivideIcon,
    label: 'Division',
    operator: '÷',
    value: 'division',
  },
  multiplication: {
    actionLabel: 'Multiply',
    icon: MultiplyIcon,
    label: 'Multiplication',
    operator: '×',
    value: 'multiplication',
  },
  subtraction: {
    actionLabel: 'Subtract',
    icon: SubtractIcon,
    label: 'Subtraction',
    operator: '-',
    value: 'subtraction',
  },
} as const

export const OPERATIONS = [
  OPERATION.addition.value,
  OPERATION.division.value,
  OPERATION.multiplication.value,
  OPERATION.subtraction.value,
] as const;
