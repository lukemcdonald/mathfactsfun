import { useState } from 'react'

import { Icons } from '#app/components/common/icons'
import { IconButton } from '#app/components/ui/icon-button'
import { AddStudentDialog } from '#app/routes/resources/group-members/add'

import type { Group } from '#app/features/groups/groups.types'

type AddStudentButtonProps = {
  groupId: Group['id']
  groupName: Group['name']
}

export function AddStudentButton({ groupId, groupName }: AddStudentButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (openStatus: boolean) => {
    setOpen(openStatus)
  }

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        variant="outline"
        label={`Add student to ${groupName} group`}
        icon={Icons.AddGroupMember}
        size="sm"
      />

      <AddStudentDialog
        groupId={groupId}
        onOpenChange={handleOpenChange}
        open={open}
      />
    </>
  )
}
