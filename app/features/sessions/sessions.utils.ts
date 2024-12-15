import { getErrorMessage } from '#app/utils/errors'
import { calculatePercentage, calculateRatio } from '#app/utils/misc'

import { Session, SerializedSession } from './sessions.types'

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
  return calculateRatio(correctAnswers, totalQuestions)
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
  return calculatePercentage(correctAnswers, totalQuestions)
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

  return calculatePercentage(totalAccuracy, totalSessions)
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

  return Math.round(calculateRatio(totalTime, totalSessions))
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

/**
 * Converts string dates in a serialized session back to Date objects.
 * This is needed because dates are serialized to strings when sent from the server.
 *
 * @param {JsonifyObject<SerializedSession>} session - The serialized session with string dates
 * @returns {SerializedSession} - The session with proper Date objects
 */
export function deserializeSession(
  session: Omit<SerializedSession, 'createdAt' | 'updatedAt'> & {
    createdAt: string
    updatedAt: string
  },
): SerializedSession {
  return {
    ...session,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
  }
}
