import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMockStore } from '@/lib/mock/mockStore'
import { ToastViewport } from '@/components/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AccessibilityEffects() {
  const a11y = useMockStore((s) => s.accessibility)

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-large-text', a11y.largerText)
    document.documentElement.classList.toggle('a11y-visual-clarity', a11y.visualClarity)
    document.documentElement.classList.toggle('reduce-motion', a11y.reducedMotion)
  }, [a11y])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityEffects />
      {children}
      <ToastViewport />
    </QueryClientProvider>
  )
}
