import { Form } from '@remix-run/react'

import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#app/components/ui/dialog'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'

interface AddStudentDialogProps {
  groupId: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function AddStudentDialog({ groupId, onOpenChange, open }: AddStudentDialogProps) {
  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student to Group</DialogTitle>
        </DialogHeader>
        <Form
          className="space-y-4"
          method="post"
        >
          <input
            name="action"
            type="hidden"
            value="addStudent"
          />
          <input
            name="groupId"
            type="hidden"
            value={groupId}
          />
          <div>
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input
              id="studentEmail"
              name="studentEmail"
              placeholder="Enter student email"
              required
              type="email"
            />
          </div>
          <Button type="submit">Add Student</Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
