import { RemoveStudentButton } from '#app/components/dashboard/remove-student-button'
import { ViewProgressButton } from '#app/components/dashboard/view-progress-button'

import type { Group, StudentProgress } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

type GroupMembersListItemProps = {
  groupId: Group['id']
  studentEmail: User['email']
  studentId: User['id']
  studentName: User['name']
  studentProgress: StudentProgress
}

export function GroupMembersListItem({
  groupId,
  studentEmail,
  studentId,
  studentName,
  studentProgress,
}: GroupMembersListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{studentName}</p>
        <p className="text-sm text-gray-500">{studentEmail}</p>
      </div>

      <div className="flex gap-2">
        <ViewProgressButton
          studentName={studentName}
          studentProgress={studentProgress}
        />
        <RemoveStudentButton
          groupId={groupId}
          studentId={studentId}
          studentName={studentName}
        />
      </div>
    </div>
  )
}
