import { getErrorMessage } from '#app/utils/errors'

import { Session } from './sessions.types'

/**
 * Calculates the accuracy ratio for a single session.
 *
 * @param {number} correctAnswers - The number of correct answers.
 * @param {number} totalQuestions - The total number of questions.
 * @returns {number} - The accuracy as a decimal between 0 and 1.
 */
function calculateAccuracy(correctAnswers: number, totalQuestions: number) {
  return totalQuestions > 0 ? correctAnswers / totalQuestions : 0
}

/**
 * Calculates the accuracy percentage for a single session.
 *
 * @param {number} correctAnswers - The number of correct answers.
 * @param {number} totalQuestions - The total number of questions.
 * @returns {number} - The accuracy as a percentage (0-100).
 */
function calculateAccuracyPercentage(correctAnswers: number, totalQuestions: number) {
  const ratio = calculateAccuracy(correctAnswers, totalQuestions)
  return Math.round(ratio * 100)
}

/**
 * Calculates the accuracy ratio for a single session.
 *
 * @param {Object} session - The session object containing correctAnswers and totalQuestions.
 * @returns {number} - The accuracy as a decimal between 0 and 1.
 */
export function calculateSessionAccuracy(session: {
  correctAnswers: number
  totalQuestions: number
}) {
  const { correctAnswers, totalQuestions } = session
  return calculateAccuracy(correctAnswers, totalQuestions)
}

/**
 * Calculates the accuracy percentage for a single session.
 *
 * @param {Object} session - The session object containing correctAnswers and totalQuestions.
 * @returns {number} - The accuracy as a percentage (0-100).
 */
export function calculateSessionAccuracyPercentage(session: {
  correctAnswers: number
  totalQuestions: number
}) {
  const { correctAnswers, totalQuestions } = session
  return calculateAccuracyPercentage(correctAnswers, totalQuestions)
}

/**
 * Calculates the average accuracy from a list of sessions.
 *
 * @param {Array} sessions - The list of session objects.
 * @returns {number} - The average accuracy as a percentage.
 */
export function calculateAverageAccuracy(sessions: Session[]) {
  const totalSessions = sessions.length

  if (totalSessions === 0) {
    return 0
  }

  const totalAccuracy = sessions.reduce(
    (acc, session) => acc + calculateSessionAccuracy(session),
    0,
  )

  return calculateAccuracyPercentage(totalAccuracy, totalSessions)
}

/**
 * Calculates the average time from a list of sessions.
 *
 * @param {Array} sessions - The list of session objects.
 * @returns {number} - The average time.
 */
export function calculateAverageTime(sessions: Session[]) {
  const totalSessions = sessions.length

  if (totalSessions === 0) {
    return 0
  }

  const totalTime = sessions.reduce((acc, session) => acc + session.averageTime, 0)

  return Math.round(totalTime / totalSessions)
}

/**
 * Formats a timestamp into an ISO 8601 date string, or returns a default value.
 * If the conversion returns null (indicating an invalid or null timestamp),
 * the provided default value is returned instead.
 *
 * @param {null | number} timestamp - The timestamp to format.
 * @param {string} defaultValue - The default ISO string to return if the timestamp is null or invalid.
 * @returns {string} - The ISO formatted date string or the default value if the timestamp is null or invalid.
 */
export function formatDate(timestamp: null | number, defaultValue: string): string {
  return timestampToISOString(timestamp) || defaultValue
}

/**
 * Converts a timestamp to milliseconds.
 * Assumes timestamps greater than 10 billion are already in milliseconds,
 * otherwise treats them as seconds and converts to milliseconds.
 *
 * @param {number} timestamp - The timestamp to convert.
 * @returns {number} - The timestamp in milliseconds.
 */
function convertTimestampToMilliseconds(timestamp: number) {
  return timestamp > 1e10 ? timestamp : timestamp * 1000
}

/**
 * Converts a timestamp to an ISO 8601 formatted date string.
 * If the timestamp is null or invalid, returns null.
 * Handles timestamps in seconds or milliseconds.
 *
 * @param {null | number} timestamp - The timestamp to format.
 * @returns {null | string} - The ISO formatted date string or null if invalid timestamp.
 */
function timestampToISOString(timestamp: null | number): null | string {
  if (!timestamp) {
    return null
  }

  try {
    const ms = convertTimestampToMilliseconds(timestamp)
    return new Date(ms).toISOString()
  } catch (error) {
    console.error('Invalid timestamp:', timestamp, 'Error:', getErrorMessage(error))
    return null
  }
}
