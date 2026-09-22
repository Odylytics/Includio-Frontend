import { Outlet } from 'react-router-dom'
import { AppShell } from './AppShell'
import { employerNavItems } from './AppNav'

export function EmployerShell() {
  return (
    <AppShell workspace="employer" navItems={employerNavItems}>
      <Outlet />
    </AppShell>
  )
}
