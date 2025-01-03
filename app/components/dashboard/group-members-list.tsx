import { GroupMembersListItem } from '#app/components/dashboard/group-members-list-item'

import type { Group, StudentProgressMap } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

type GroupMembersListProps = {
  groupId: Group['id']
  groupMembers: { student: User }[]
  studentsProgress: StudentProgressMap
}

export function GroupMembersList({
  groupId,
  groupMembers,
  studentsProgress,
}: GroupMembersListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {groupMembers.map(({ student }: { student: User }) => (
        <GroupMembersListItem
          key={student.id}
          groupId={groupId}
          studentEmail={student.email}
          studentId={student.id}
          studentName={student.name}
          studentProgress={studentsProgress[student.id]}
        />
      ))}
    </div>
  )
}
