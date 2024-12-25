/**
 * Central export point for all database tables and their relations.
 * This file prevents circular dependencies between feature modules
 * and provides a single source of truth for database schema imports.
 */

export { groupMembers, groupMembersRelations } from '#app/features/groups/groups.db.server'
export { groups, groupsRelations } from '#app/features/groups/groups.db.server'
export { questions, questionsRelations } from '#app/features/questions/questions.db.server'
export { sessions, sessionsRelations } from '#app/features/sessions/sessions.db.server'
export {
  subscriptions,
  subscriptionsRelations,
} from '#app/features/subscriptions/subscriptions.db.server'
export { users, usersRelations } from '#app/features/users/users.db.server'
