import { Icons } from '#app/components/common/icons'

export const OPERATION = {
  addition: {
    actionLabel: 'Add',
    icon: Icons.Plus,
    label: 'Addition',
    operator: '+',
    value: 'addition',
  },
  division: {
    actionLabel: 'Divide',
    icon: Icons.Divide,
    label: 'Division',
    operator: '÷',
    value: 'division',
  },
  multiplication: {
    actionLabel: 'Multiply',
    icon: Icons.Multiply,
    label: 'Multiplication',
    operator: '×',
    value: 'multiplication',
  },
  subtraction: {
    actionLabel: 'Subtract',
    icon: Icons.Minus,
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
] as const
