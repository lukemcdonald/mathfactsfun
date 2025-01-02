'use client'

import { useState } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { Icons } from '#app/components/common/icons'
import { IconButton } from '#app/components/ui/icon-button'

import type { PropsWithChildren } from 'react'

function MobileSidebar({
  children,
  close,
  open,
}: PropsWithChildren<{ close: () => void; open: boolean }>) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={close}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
        <DialogPrimitive.Content className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full">
          <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5">
            <div className="p-3">
              <IconButton
                onClick={close}
                label="Close navigation"
                icon={Icons.CloseMenu}
              />
            </div>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function StackedLayout({
  children,
  navbar,
  sidebar,
}: React.PropsWithChildren<{ navbar: React.ReactNode; sidebar: React.ReactNode }>) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100">
      {/* Sidebar on mobile */}
      <MobileSidebar
        open={showSidebar}
        close={() => setShowSidebar(false)}
      >
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 lg:hidden">
          <IconButton
            onClick={() => setShowSidebar(true)}
            label="Open navigation"
            icon={Icons.OpenMenu}
          />
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:px-2">
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  )
}
