import { useEffect } from 'react'
import { useFetcher } from 'react-router'

import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { FormErrors } from '#app/components/common/form-errors'
import { InputField } from '#app/components/common/input-field'
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
import { addGroupMember, getGroupMember } from '#app/features/groups/groups.server'
import { getUserByEmail } from '#app/features/users/users.server'

import type { Route } from './+types/add'

const addStudentSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  studentEmail: z.string().email('Invalid email address'),
})

interface AddStudentDialogProps {
  groupId: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  open: boolean
}

export function AddStudentDialog({
  groupId,
  onOpenChange,
  onSuccess,
  open,
}: AddStudentDialogProps) {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const [form, fields] = useForm({
    constraint: getZodConstraint(addStudentSchema),
    id: 'add-student-form',
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addStudentSchema })
    },
    shouldRevalidate: 'onBlur',
  })

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
          <DialogTitle>Add Student to Group</DialogTitle>
        </DialogHeader>

        <fetcher.Form
          className="space-y-4"
          id={form.id}
          action={getRoute.resources.groupMembers.add()}
          method="post"
          onSubmit={form.onSubmit}
        >
          <input
            type="hidden"
            name="groupId"
            value={groupId}
          />

          <InputField
            field={fields.studentEmail}
            label="Student Email"
            type="email"
            data-1p-ignore
          />

          <FormErrors errors={form.errors} />

          <DialogFooter>
            <Button
              isLoading={isSubmitting}
              loadingText="Adding student..."
              type="submit"
            >
              Add Student
            </Button>
          </DialogFooter>
        </fetcher.Form>
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
  const submission = parseWithZod(formData, { schema: addStudentSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const { groupId, studentEmail } = submission.value
  const student = await getUserByEmail(db, studentEmail)

  if (!student) {
    return submission.reply({
      fieldErrors: {
        studentEmail: ['No student found with this email'],
      },
    })
  }

  if (student.role !== 'student') {
    return submission.reply({
      fieldErrors: {
        studentEmail: ['This user is not a student'],
      },
    })
  }

  const existingMember = await getGroupMember(db, groupId, student.id)

  if (existingMember) {
    return submission.reply({
      fieldErrors: {
        studentEmail: ['Student is already in this group'],
      },
    })
  }

  await addGroupMember(db, {
    groupId,
    id: nanoid(),
    studentId: student.id,
  })

  return { message: 'Student added successfully' }
}
