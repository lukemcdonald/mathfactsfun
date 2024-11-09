'use client'

import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { db } from '~/db'
import { groups } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Users, BookOpen, TrendingUp } from 'lucide-react'
import { CreateGroupDialog } from '~/components/dashboard/create-group-dialog'
import { useState } from 'react'

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  if (!user) return redirect('/login')
  if (user.role !== 'teacher') return redirect('/dashboard/student')

  const teacherGroups = await db.query.groups.findMany({
    where: eq(groups.teacherId, user.id),
    with: {
      groupMembers: {
        with: {
          student: true,
        },
      },
    },
  })

  return json({ user, groups: teacherGroups })
}

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
              {groups.reduce((acc, group) => acc + group.members.length, 0)}
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
                  {group.members.map((member) => (
                    <div
                      key={member.student.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{member.student.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.student.email}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
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
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
      />
    </div>
  )
}
