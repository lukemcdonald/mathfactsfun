import { useState } from 'react'

import { Icons } from '#app/components/common/icons'
import { IconButton } from '#app/components/ui/icon-button'
import { RemoveStudentDialog } from '#app/routes/resources/group-members/remove'

import type { Group } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

type RemoveStudentButtonProps = {
  groupId: Group['id']
  studentId: User['id']
  studentName: User['name']
}

export function RemoveStudentButton({ groupId, studentId, studentName }: RemoveStudentButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (openStatus: boolean) => {
    setOpen(openStatus)
  }

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        size="sm"
        variant="outline"
        label={`Remove ${studentName} from group`}
        icon={Icons.RemoveUser}
      />

      <RemoveStudentDialog
        groupId={groupId}
        onOpenChange={handleOpenChange}
        open={open}
        studentId={studentId}
        studentName={studentName}
      />
    </>
  )
}
