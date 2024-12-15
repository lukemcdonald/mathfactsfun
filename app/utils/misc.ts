import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single class string.
 *
 * @param {...ClassValue[]} inputs - The class values to combine.
 * @returns {string} - The combined class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the ratio of a part to a whole.
 *
 * @param {number} part - The portion or subset of the total.
 * @param {number} total - The total or whole amount.
 * @returns {number} - The ratio as a decimal between 0 and 1, or 0 if the total is zero.
 */
export function calculateRatio(part: number, total: number): number {
  return total > 0 ? part / total : 0
}

/**
 * Calculates the percentage of a part relative to a whole.
 *
 * @param {number} part - The portion or subset of the total.
 * @param {number} total - The total or whole amount.
 * @returns {number} - The percentage representation of the part relative to the total (0-100).
 */
export function calculatePercentage(part: number, total: number): number {
  const ratio = calculateRatio(part, total)
  return Math.round(ratio * 100)
}
