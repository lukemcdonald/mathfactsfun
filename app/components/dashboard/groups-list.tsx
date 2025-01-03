import { GroupsListItem } from '#app/components/dashboard/groups-list-item'

import type { GroupWithStudentMembers, StudentProgressMap } from '#app/features/groups/groups.types'

type GroupsListProps = {
  groups: GroupWithStudentMembers[]
  studentsProgress: StudentProgressMap
}

export function GroupsList({ groups, studentsProgress }: GroupsListProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <GroupsListItem
          key={group.id}
          groupId={group.id}
          groupMembers={group.groupMembers}
          groupName={group.name}
          studentsProgress={studentsProgress}
        />
      ))}
    </div>
  )
}
