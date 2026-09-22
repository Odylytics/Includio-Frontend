import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function EmployerShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[var(--sidebar-w)_1fr]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0">
        <Topbar workspace="employer" onMenu={() => setMobileOpen(true)} />
        <main className="page-enter px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
