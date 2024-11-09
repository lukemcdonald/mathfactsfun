'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Form } from '@remix-run/react'

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGroupDialog({
  open,
  onOpenChange,
}: CreateGroupDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          className="space-y-4"
        >
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              required
            />
          </div>
          <Button type="submit">Create Group</Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
