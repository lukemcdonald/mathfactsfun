import { AddStudentButton } from '#app/components/dashboard/add-student-button'
import { GroupMembers } from '#app/components/dashboard/group-members'
import { RemoveGroupButton } from '#app/components/dashboard/remove-group-button.js'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'

import type { Group, StudentProgressMap } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

type GroupsListItemProps = {
  groupId: Group['id']
  groupMembers: { student: User }[]
  groupName: Group['name']
  studentsProgress: StudentProgressMap
}

export function GroupsListItem({
  groupId,
  groupMembers,
  groupName,
  studentsProgress,
}: GroupsListItemProps) {
  return (
    <>
      <Card key={groupId}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{groupName}</CardTitle>

          <div className="flex gap-2">
            <AddStudentButton
              groupId={groupId}
              groupName={groupName}
            />
            <RemoveGroupButton
              groupMembersCount={groupMembers.length}
              groupId={groupId}
              groupName={groupName}
            />
          </div>
        </CardHeader>

        <CardContent>
          <GroupMembers
            groupId={groupId}
            groupMembers={groupMembers}
            studentsProgress={studentsProgress}
          />
        </CardContent>
      </Card>
    </>
  )
}
