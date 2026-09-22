import { Outlet } from 'react-router-dom'
import { AppShell } from './AppShell'
import { candidateNavItems } from './AppNav'

export function CandidateShell() {
  return (
    <AppShell workspace="candidate" navItems={candidateNavItems}>
      <Outlet />
    </AppShell>
  )
}
