import { SelectSession } from "./sessions.types";

/**
 * Calculates the average accuracy from a list of sessions.
 *
 * @param {Array} sessions - The list of session objects.
 * @returns {number} - The average accuracy as a percentage.
 */
export function calculateAverageAccuracy(sessions: SelectSession[]) {
  const totalSessions = sessions.length;
  if (totalSessions === 0) return 0;

  const totalAccuracy = sessions.reduce((acc, session) => {
    return acc + (session.correctAnswers / session.totalQuestions);
  }, 0);

  return Math.round((totalAccuracy / totalSessions) * 100);
}

/**
 * Calculates the average time from a list of sessions.
 *
 * @param {Array} sessions - The list of session objects.
 * @returns {number} - The average time.
 */
export function calculateAverageTime(sessions: SelectSession[]) {
  const totalSessions = sessions.length;
  if (totalSessions === 0) return 0;

  const totalTime = sessions.reduce((acc, session) => acc + session.averageTime, 0);

  return Math.round(totalTime / totalSessions);
}

import { getErrorMessage } from "~/utils/errors";

/**
 * Converts a timestamp to milliseconds.
 * Assumes timestamps greater than 10 billion are already in milliseconds,
 * otherwise treats them as seconds and converts to milliseconds.
 *
 * @param {number} timestamp - The timestamp to convert.
 * @returns {number} - The timestamp in milliseconds.
 */
function convertTimestampToMilliseconds(timestamp: number) {
  return timestamp > 1e10 ? timestamp : timestamp * 1000;
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
  return timestampToISOString(timestamp) || defaultValue;
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
    return null;
  }

  try {
    const ms = convertTimestampToMilliseconds(timestamp);
    return new Date(ms).toISOString();
  } catch (error) {
    console.error('Invalid timestamp:', timestamp, 'Error:', getErrorMessage(error));
    return null;
  }
}
