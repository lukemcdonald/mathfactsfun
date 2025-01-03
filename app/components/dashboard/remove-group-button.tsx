import { useState } from 'react'

import { Icons } from '#app/components/common/icons'
import { IconButton } from '#app/components/ui/icon-button'
import { RemoveGroupDialog } from '#app/routes/resources/groups/remove'

import type { Group } from '#app/features/groups/groups.types'

type RemoveGroupButtonProps = {
  groupId: Group['id']
  groupMembersCount: number
  groupName: Group['name']
}

export function RemoveGroupButton({
  groupId,
  groupMembersCount,
  groupName,
}: RemoveGroupButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (openStatus: boolean) => {
    setOpen(openStatus)
  }

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        variant="outline"
        label={`Remove ${groupName} group`}
        icon={Icons.RemoveGroup}
        size="sm"
      />

      <RemoveGroupDialog
        groupId={groupId}
        groupName={groupName}
        groupMembersCount={groupMembersCount}
        onOpenChange={handleOpenChange}
        open={open}
        onSuccess={() => setOpen(false)}
      />
    </>
  )
}
