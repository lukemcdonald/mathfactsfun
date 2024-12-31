import { useEffect } from 'react'
import { useFetcher } from 'react-router'

import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

import { Button } from '#app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#app/components/ui/dialog'
import { getRoute } from '#app/config/routes'
import { db } from '#app/db/db.server'
import { getUser } from '#app/features/auth/auth.server'
import { removeGroupMember } from '#app/features/groups/groups.server'

import type { Route } from './+types/remove'

const removeStudentSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
})

interface RemoveStudentDialogProps {
  groupId: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  open: boolean
  studentId: string
  studentName: string
}

export function RemoveStudentDialog({
  groupId,
  onOpenChange,
  onSuccess,
  open,
  studentId,
  studentName,
}: RemoveStudentDialogProps) {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'
  const formId = 'remove-student-form'

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.message) {
      onSuccess?.()
    }
  }, [fetcher.state, fetcher.data, onSuccess])

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Student from Group</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <p>
            Are you sure you want to remove <strong>{studentName}</strong> from this group?
          </p>
          <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
        </div>

        <fetcher.Form
          action={getRoute.resources.groupMembers.remove()}
          method="post"
          id={formId}
        >
          <input
            type="hidden"
            name="groupId"
            value={groupId}
          />
          <input
            type="hidden"
            name="studentId"
            value={studentId}
          />
        </fetcher.Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Removing..."
            form={formId}
          >
            Remove Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export async function action({ request }: Route.ActionArgs) {
  const user = await getUser(request)

  if (!user || user.role !== 'teacher') {
    throw new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: removeStudentSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const { groupId, studentId } = submission.value

  await removeGroupMember(db, groupId, studentId)

  return { message: 'Student removed successfully' }
}
