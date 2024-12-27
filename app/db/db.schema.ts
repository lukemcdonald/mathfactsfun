/**
 * Central export point for all database tables and their relations.
 * This file prevents circular dependencies between feature modules
 * and provides a single source of truth for database schema imports.
 */

export { groupMembers, groupMembersRelations } from '#app/features/groups/groups.db'
export { groups, groupsRelations } from '#app/features/groups/groups.db'
export { questions, questionsRelations } from '#app/features/questions/questions.db'
export { sessions, sessionsRelations } from '#app/features/sessions/sessions.db'
export { subscriptions, subscriptionsRelations } from '#app/features/subscriptions/subscriptions.db'
export { users, usersRelations } from '#app/features/users/users.db'
