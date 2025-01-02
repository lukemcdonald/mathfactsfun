import { Branding } from '#app/components/common/branding'
import { Navbar } from '#app/components/common/navbar'
import { getRoute } from '#app/config/routes'

export function MobileNavbar() {
  return (
    <Navbar className="flex h-full min-h-0 flex-col">
      <Branding className="max-lg:hidden" />
      <div className="flex w-full flex-1 flex-col overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          <Navbar.Item
            className="justify-start"
            to={getRoute.home()}
          >
            Home
          </Navbar.Item>
        </div>
      </div>
    </Navbar>
  )
}
