import { useState } from 'react'
import { redirect } from 'react-router'

import { nanoid } from 'nanoid'

import { CreateGroupDialog } from '#app/components/dashboard/create-group-dialog'
import { ViewProgressDialog } from '#app/components/dashboard/view-progress-dialog'
import { Icons } from '#app/components/icons'
import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { IconButton } from '#app/components/ui/icon-button.js'
import { getRoute } from '#app/config/routes'
import { db } from '#app/db/db.server'
import { getUser } from '#app/features/auth/auth.server'
import { createGroup, getGroupsByTeacherId } from '#app/features/groups/groups.server'
import { getStudentProgress } from '#app/features/sessions/sessions.server'
// import { toast } from '#app/hooks/use-toast'
import { AddStudentDialog } from '#app/routes/resources/group-members/add'

import type { GroupWithMembers, GroupWithStudentMembers } from '#app/features/groups/groups.types'

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
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<null | string>(null)
  const [selectedStudent, setSelectedStudent] = useState<null | { id: string; name: string }>(null)

  const handleAddStudent = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const handleAddStudentSuccess = () => {
    setSelectedGroupId(null)
  }

  const handleCreateGroupSuccess = () => {
    setIsCreateGroupOpen(false)
  }

  const handleViewProgress = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={() => setIsCreateGroupOpen(true)}>Create New Group</Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Users className="h-5 w-5 text-blue-500" />
              Total Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Book className="h-5 w-5 text-green-500" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {groups.reduce(
                (acc: number, group: GroupWithMembers) => acc + group.groupMembers.length,
                0,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.TrendingUp className="h-5 w-5 text-purple-500" />
              Practice Sessions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {groups.map((group: GroupWithStudentMembers) => (
          <Card key={group.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{group.name}</CardTitle>
              <Button
                onClick={() => handleAddStudent(group.id)}
                variant="outline"
              >
                Add Student
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Students</h4>
                {group.groupMembers.length === 0 ?
                  <p className="text-sm text-gray-500">No students in this group yet</p>
                : <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {group.groupMembers.map((member) => (
                      <div
                        className="flex items-center justify-between rounded-lg border p-4"
                        key={member.student.id}
                      >
                        <div>
                          <p className="font-medium">{member.student.name}</p>
                          <p className="text-sm text-gray-500">{member.student.email}</p>
                        </div>

                        <IconButton
                          onClick={() => handleViewProgress(member.student.id, member.student.name)}
                          size="sm"
                          variant="outline"
                          label={`View ${member.student.name}'s progress report`}
                          icon={Icons.TrendingUp}
                        />
                      </div>
                    ))}
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateGroupDialog
        onOpenChange={setIsCreateGroupOpen}
        onSuccess={handleCreateGroupSuccess}
        open={isCreateGroupOpen}
      />

      <AddStudentDialog
        groupId={selectedGroupId || ''}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGroupId(null)
          }
        }}
        onSuccess={handleAddStudentSuccess}
        open={!!selectedGroupId}
      />

      {selectedStudent && (
        <ViewProgressDialog
          onOpenChange={(open) => {
            if (!open) {
              setSelectedStudent(null)
            }
          }}
          open={!!selectedStudent}
          studentName={selectedStudent.name}
          studentProgress={studentsProgress[selectedStudent.id]}
        />
      )}
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
