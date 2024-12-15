import { useState } from 'react'

import { json, redirect } from '@remix-run/node'
import { useLoaderData, useActionData, useNavigation } from '@remix-run/react'
import { nanoid } from 'nanoid'

import { AddStudentDialog } from '#app/components/dashboard/add-student-dialog'
import { CreateGroupDialog } from '#app/components/dashboard/create-group-dialog'
import { ViewProgressDialog } from '#app/components/dashboard/view-progress-dialog'
import { Icons } from '#app/components/icons.js'
import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { getRoute } from '#app/config/routes.js'
import { db } from '#app/db'
import { getUser } from '#app/features/auth/auth.api'
import {
  addGroupMember,
  createGroup,
  getGroupMember,
  getGroupsByTeacherId,
  GroupWithMembers,
  GroupWithStudentMembers,
} from '#app/features/groups'
import { getStudentProgress } from '#app/features/sessions'
import { getUserByEmail } from '#app/features/users'
import { useToast } from '#app/hooks/use-toast'
import { DatabaseError, handleError } from '#app/utils/errors'
import { captureException } from '#app/utils/sentry.server'

export async function action({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user || user.role !== 'teacher') {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const action = formData.get('action')

  if (action === 'createGroup') {
    const groupName = formData.get('groupName')

    if (typeof groupName !== 'string' || !groupName.trim()) {
      return json({ error: 'Group name is required' }, { status: 400 })
    }

    try {
      await createGroup(db, {
        id: nanoid(),
        name: groupName,
        teacherId: user.id,
      })

      return json({ message: 'Group created successfully' })
    } catch (error) {
      captureException(
        new DatabaseError('Failed to create group', error, {
          groupName,
          teacherId: user.id,
          userId: user.id,
        }),
      )

      return handleError(error, {
        path: getRoute.dashboard.byRole('teacher'),
        userId: user.id,
      })
    }
  } else if (action === 'addStudent') {
    const studentEmail = formData.get('studentEmail')
    const groupId = formData.get('groupId')

    if (typeof studentEmail !== 'string' || !studentEmail.trim()) {
      return json({ error: 'Student email is required' }, { status: 400 })
    }

    if (typeof groupId !== 'string' || !groupId.trim()) {
      return json({ error: 'Group ID is required' }, { status: 400 })
    }

    try {
      const student = await getUserByEmail(db, studentEmail)

      if (!student) {
        return json({ error: 'No student found with this email' }, { status: 404 })
      }

      if (student.role !== 'student') {
        return json({ error: 'This user is not a student' }, { status: 400 })
      }

      // Check if student is already in the group
      const existingMember = await getGroupMember(db, groupId, student.id)

      if (existingMember) {
        return json({ error: 'Student is already in this group' }, { status: 400 })
      }

      // Add student to group
      await addGroupMember(db, {
        groupId,
        id: nanoid(),
        studentId: student.id,
      })

      return json({ message: 'Student added successfully' })
    } catch (error) {
      captureException(
        new DatabaseError('Failed to add student to group', error, {
          groupId,
          studentEmail,
          userId: user.id,
        }),
      )

      return handleError(error, {
        path: getRoute.dashboard.byRole('teacher'),
        userId: user.id,
      })
    }
  }

  return redirect(getRoute.dashboard.root())
}

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user) {
    return redirect(getRoute.auth.login())
  }

  if (user.role !== 'teacher') {
    return redirect(getRoute.dashboard.root())
  }

  try {
    const teacherGroups = await getGroupsByTeacherId(db, user.id)

    // Get progress for all students in all groups
    const studentsProgress = new Map()

    for (const group of teacherGroups) {
      for (const member of group.groupMembers) {
        if (!studentsProgress.has(member.student.id)) {
          const progress = await getStudentProgress(db, member.student.id)
          studentsProgress.set(member.student.id, progress)
        }
      }
    }

    return json({
      groups: teacherGroups,
      studentsProgress: Object.fromEntries(studentsProgress),
    })
  } catch (error) {
    captureException(
      new DatabaseError('Failed to load teacher dashboard', error, {
        userId: user.id,
      }),
    )

    return handleError(error, {
      path: getRoute.dashboard.byRole('teacher'),
      userId: user.id,
    })
  }
}

export default function TeacherDashboard() {
  const { groups, studentsProgress } = useLoaderData<typeof loader>()
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<null | string>(null)
  const [selectedStudent, setSelectedStudent] = useState<null | {
    id: string
    name: string
  }>(null)
  const { toast } = useToast()
  const actionData = useActionData<{ error?: string; message?: string }>()
  const navigation = useNavigation()

  // Handle toast notifications based on action data and navigation state
  if (actionData?.message && navigation.state === 'idle') {
    toast({
      description: actionData.message,
      title: 'Success',
    })
  } else if (actionData?.error && navigation.state === 'idle') {
    toast({
      description: actionData.error,
      title: 'Error',
      variant: 'destructive',
    })
  }

  const handleAddStudent = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const handleViewProgress = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName })
  }

  const handleCreateGroupSuccess = () => {
    setIsCreateGroupOpen(false)
  }

  const handleAddStudentSuccess = () => {
    setSelectedGroupId(null)
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
                : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.groupMembers.map((member) => (
                      <div
                        className="flex items-center justify-between rounded-lg border p-4"
                        key={member.student.id}
                      >
                        <div>
                          <p className="font-medium">{member.student.name}</p>
                          <p className="text-sm text-gray-500">{member.student.email}</p>
                        </div>
                        <Button
                          onClick={() => handleViewProgress(member.student.id, member.student.name)}
                          size="sm"
                          variant="outline"
                        >
                          View Progress
                        </Button>
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
          if (!open) setSelectedGroupId(null)
        }}
        onSuccess={handleAddStudentSuccess}
        open={!!selectedGroupId}
      />

      {selectedStudent && (
        <ViewProgressDialog
          onOpenChange={(open) => {
            if (!open) setSelectedStudent(null)
          }}
          open={!!selectedStudent}
          studentName={selectedStudent.name}
          studentProgress={studentsProgress[selectedStudent.id]}
        />
      )}
    </div>
  )
}
