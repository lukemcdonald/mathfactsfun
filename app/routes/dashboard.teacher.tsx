import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { BookOpen, TrendingUp, Users } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useState } from 'react'

import { AddStudentDialog } from '~/components/dashboard/add-student-dialog'
import { CreateGroupDialog } from '~/components/dashboard/create-group-dialog'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { db } from '~/db'
import { groupMembers } from '~/db/schema'
// import { useToast } from '~/hooks/use-toast'
import { createGroup, getGroupsByTeacherId } from '~/repositories/group'
import { getUserByEmail } from '~/repositories/user'
import { getUser } from '~/services/auth.server'

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }

  if (user.role !== 'teacher') {
    return redirect('/dashboard/student')
  }

  const teacherGroups = await getGroupsByTeacherId(db, user.id)

  return json({ groups: teacherGroups, user })
}

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

    await createGroup(db, {
      id: nanoid(),
      name: groupName,
      teacherId: user.id,
    })
  } else if (action === 'addStudent') {
    const studentEmail = formData.get('studentEmail')
    const groupId = formData.get('groupId')

    if (typeof studentEmail !== 'string' || !studentEmail.trim()) {
      return json({ error: 'Student email is required' }, { status: 400 })
    }

    if (typeof groupId !== 'string' || !groupId.trim()) {
      return json({ error: 'Group ID is required' }, { status: 400 })
    }

    const student = await getUserByEmail(db, studentEmail)

    if (!student) {
      return json(
        { error: 'No student found with this email' },
        { status: 404 },
      )
    }

    if (student.role !== 'student') {
      return json({ error: 'This user is not a student' }, { status: 400 })
    }

    // Check if student is already in the group
    const existingMember = await db.query.groupMembers.findFirst({
      where: (groupMembers, { and, eq }) =>
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.studentId, student.id),
        ),
    })

    if (existingMember) {
      return json(
        { error: 'Student is already in this group' },
        { status: 400 },
      )
    }

    // Add student to group
    await db.insert(groupMembers).values({
      groupId,
      id: nanoid(),
      studentId: student.id,
    })
  }

  return redirect('/dashboard/teacher')
}

export default function TeacherDashboard() {
  const { groups } = useLoaderData<typeof loader>()
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<null | string>(null)
  // const { toast } = useToast()

  const handleAddStudent = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={() => setIsCreateGroupOpen(true)}>
          Create New Group
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
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
              <BookOpen className="h-5 w-5 text-green-500" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {groups.reduce(
                (acc, group) => acc + group.groupMembers.length,
                0,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Practice Sessions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
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
                  <p className="text-sm text-gray-500">
                    No students in this group yet
                  </p>
                : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.groupMembers.map((member) => (
                      <div
                        className="flex items-center justify-between rounded-lg border p-4"
                        key={member.student.id}
                      >
                        <div>
                          <p className="font-medium">{member.student.name}</p>
                          <p className="text-sm text-gray-500">
                            {member.student.email}
                          </p>
                        </div>
                        <Button
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
        open={isCreateGroupOpen}
      />

      <AddStudentDialog
        groupId={selectedGroupId || ''}
        onOpenChange={(open) => {
          if (!open) setSelectedGroupId(null)
        }}
        open={!!selectedGroupId}
      />
    </div>
  )
}
