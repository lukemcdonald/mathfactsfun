import { Icons } from '#app/components/common/icons'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'

import type { GroupWithMembers } from '#app/features/groups/groups.types'

export function OverviewCards({ groups }: { groups: GroupWithMembers[] }) {
  return (
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
  )
}
