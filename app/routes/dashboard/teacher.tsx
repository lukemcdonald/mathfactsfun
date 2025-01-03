import { redirect } from 'react-router'

import { nanoid } from 'nanoid'

import { GroupsWithStudents } from '#app/components/dashboard/groups-with-students'
import { OverviewCards } from '#app/components/dashboard/overview-cards'
import { getRoute } from '#app/config/routes'
import { db } from '#app/db/db.server'
import { getUser } from '#app/features/auth/auth.server'
import { createGroup, getGroupsByTeacherId } from '#app/features/groups/groups.server'
import { getStudentProgress } from '#app/features/sessions/sessions.server'

import type { Route } from './+types/teacher'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request)

  if (!user) {
    return redirect(getRoute.auth.login())
  }

  if (user.role !== 'teacher') {
    return redirect(getRoute.dashboard.root())
  }

  const teacherGroups = await getGroupsByTeacherId(db, user.id)
  const studentsProgress = new Map()

  for (const group of teacherGroups) {
    for (const member of group.groupMembers) {
      if (!studentsProgress.has(member.student.id)) {
        const progress = await getStudentProgress(db, member.student.id)
        studentsProgress.set(member.student.id, progress)
      }
    }
  }

  return {
    groups: teacherGroups,
    studentsProgress: Object.fromEntries(studentsProgress),
  }
}

export default function TeacherDashboard({ loaderData }: Route.ComponentProps) {
  const { groups, studentsProgress } = loaderData

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      </div>

      <OverviewCards groups={groups} />

      <GroupsWithStudents
        groups={groups}
        studentsProgress={studentsProgress}
      />
    </div>
  )
}

export async function action({ request }: Route.ActionArgs) {
  const user = await getUser(request)

  if (!user || user.role !== 'teacher') {
    throw new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const action = formData.get('action')

  if (action === 'createGroup') {
    const groupName = formData.get('groupName')

    if (typeof groupName !== 'string' || !groupName.trim()) {
      return { error: 'Group name is required' }
    }

    await createGroup(db, {
      id: nanoid(),
      name: groupName,
      teacherId: user.id,
    })

    return { message: 'Group created successfully' }
  }

  return redirect(getRoute.dashboard.root())
}

// export async function clientAction({ serverAction }: Route.ClientActionArgs) {
//   const result = await serverAction()

//   const data = result as { error?: string; message?: string }

//   if (data.message) {
//     toast({
//       description: data.message,
//       title: 'Success',
//     })
//   } else if (data.error) {
//     toast({
//       description: data.error,
//       title: 'Error',
//       variant: 'destructive',
//     })
//   }

//   return result
// }
