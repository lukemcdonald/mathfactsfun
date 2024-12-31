import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

import { db } from '#app/db/db.server'
import { getUser } from '#app/features/auth/auth.server'

import type { Route } from './+types/remove'

const removeStudentSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
})

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

  // TODO: Implement remove student logic
  throw new Response('Not implemented', { status: 501 })
}
