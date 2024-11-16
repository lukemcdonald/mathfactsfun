import { eq } from 'drizzle-orm';

import { OPERATIONS } from '~/constants/operations';
import { sessions } from '~/db/schema';
import { getRecentSessionsByUserId } from '~/repositories/session';
import { Database } from '~/types/misc';
import { OperationStats, SessionStats } from '~/types/session';
import { calculateAverageAccuracy, calculateAverageTime } from '~/utils/session';

export async function getStudentStats(db: Database, userId: string): Promise<SessionStats> {
  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
  });

  const recentSessions = await getRecentSessionsByUserId(db, userId);

  // Initialize stats for each operation
  const byOperation: Record<string, OperationStats> = {};

  OPERATIONS.forEach((op) => {
    const opSessions = allSessions.filter((s) => s.operation === op);

    byOperation[op] = {
      accuracy: calculateAverageAccuracy(opSessions),
      averageTime: calculateAverageTime(opSessions),
      totalSessions: opSessions.length,
    };
  });

  // Calculate overall stats
  const overall = {
    accuracy: calculateAverageAccuracy(allSessions),
    averageTime: calculateAverageTime(allSessions),
    totalSessions: allSessions.length,
  };

  return {
    byOperation,
    overall,
    recentSessions,
  };
}
