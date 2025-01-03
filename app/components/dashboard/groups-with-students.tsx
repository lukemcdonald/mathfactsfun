import { useState } from 'react'

import { CreateGroupDialog } from '#app/components/dashboard/create-group-dialog'
import { GroupsList } from '#app/components/dashboard/groups-list'
import { Button } from '#app/components/ui/button'

import type { GroupWithStudentMembers, StudentProgress } from '#app/features/groups/groups.types'

export function GroupsWithStudents({
  groups,
  studentsProgress,
}: {
  groups: GroupWithStudentMembers[]
  studentsProgress: Record<string, StudentProgress>
}) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (openStatus: boolean) => {
    setOpen(openStatus)
  }

  return (
    <section>
      <header>
        <h2 className="text-2xl font-bold">Groups</h2>
        <Button onClick={() => setOpen(!open)}>Create New Group</Button>
      </header>

      <GroupsList
        studentsProgress={studentsProgress}
        groups={groups}
      />

      <CreateGroupDialog
        onOpenChange={handleOpenChange}
        onSuccess={() => setOpen(false)}
        open={open}
      />
    </section>
  )
}
