import { eq } from 'drizzle-orm';

import { sessions } from '~/db/schema';
import { getRecentSessionsByUserId } from '~/repositories/session';
import { Database } from '~/types/misc';
import { calculateAverageAccuracy, calculateAverageTime } from '~/utils/session';

export async function getStudentProgress(db: Database, userId: string) {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
  });

  const recentSessions = await getRecentSessionsByUserId(db, userId, 5);
  const totalSessions = allSessions.length;

  const averageAccuracy = calculateAverageAccuracy(allSessions);
  const averageTime = calculateAverageTime(allSessions);

  return {
    averageAccuracy,
    averageTime,
    recentSessions,
    totalSessions,
  };
}
