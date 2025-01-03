import { useState } from 'react'

import { Icons } from '#app/components/common/icons'
import { ViewProgressDialog } from '#app/components/dashboard/view-progress-dialog'
import { IconButton } from '#app/components/ui/icon-button'

import type { StudentProgress } from '#app/features/groups/groups.types'
import type { User } from '#app/features/users/users.types'

export function ViewProgressButton({
  studentName,
  studentProgress,
}: {
  studentName: User['name']
  studentProgress: StudentProgress
}) {
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
        label={`View ${studentName}'s progress report`}
        icon={Icons.TrendingUp}
      />

      <ViewProgressDialog
        onOpenChange={handleOpenChange}
        open={open}
        studentName={studentName}
        studentProgress={studentProgress}
      />
    </>
  )
}
