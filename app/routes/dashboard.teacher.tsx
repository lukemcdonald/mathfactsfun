// Import necessary modules and functions
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { BookOpen, TrendingUp, Users } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useState } from 'react'

import { CreateGroupDialog } from '~/components/dashboard/create-group-dialog'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { db } from '~/db'
import { createGroup, getGroupsByTeacherId } from '~/repositories/group'
import { getUser } from '~/services/auth.server'

// Loader function to fetch data
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

// Action function to handle form submissions
export async function action({ request }: { request: Request }) {
  const user = await getUser(request)

  if (!user || user.role !== 'teacher') {
    return redirect('/login')
  }

  const formData = await request.formData()
  const groupName = formData.get('groupName')

  if (typeof groupName !== 'string' || !groupName.trim()) {
    return json({ error: 'Group name is required' }, { status: 400 })
  }

  await createGroup(db, {
    id: nanoid(),
    name: groupName,
    teacherId: user.id,
  })

  return redirect('/dashboard/teacher')
}

// The main component for the teacher dashboard
export default function TeacherDashboard() {
  const { groups } = useLoaderData<typeof loader>()
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

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
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Students</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateGroupDialog
        onOpenChange={setIsCreateGroupOpen}
        open={isCreateGroupOpen}
      />
    </div>
  )
}
