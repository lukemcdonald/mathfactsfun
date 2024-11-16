import { SelectSession } from "~/db/schemas/sessions";

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
