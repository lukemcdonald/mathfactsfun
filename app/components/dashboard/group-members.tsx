import { GroupMembersList } from '#app/components/dashboard/group-members-list'

import type { Group, StudentProgressMap } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

type GroupMembersProps = {
  groupId: Group['id']
  groupMembers: { student: User }[]
  studentsProgress: StudentProgressMap
}

export function GroupMembers({ groupId, groupMembers, studentsProgress }: GroupMembersProps) {
  if (groupMembers.length === 0) {
    return <p className="text-sm text-gray-500">No students in this group yet</p>
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Students</h4>

      <GroupMembersList
        groupId={groupId}
        groupMembers={groupMembers}
        studentsProgress={studentsProgress}
      />
    </div>
  )
}
