import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/ui/SkipLink'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { ShortcutsHelp } from '@/components/ui/ShortcutsHelp'
import { useTypingStore } from '@/stores/typingStore'
import { cn } from '@/lib/utils'

const TestPage = lazy(() =>
  import('@/components/typing/TestPage').then((m) => ({ default: m.TestPage }))
)
const DashboardPage = lazy(() =>
  import('@/components/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const LeaderboardPage = lazy(() =>
  import('@/components/dashboard/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage }))
)
const SettingsPage = lazy(() =>
  import('@/components/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-[var(--text-secondary)] text-sm animate-pulse">Loading...</div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const tick = useTypingStore((s) => s.tick)
  const initTest = useTypingStore((s) => s.initTest)
  const isStartedTab = useTypingStore((s) => s.isStarted)
  const isFinished = useTypingStore((s) => s.isFinished)
  const resetTest = useTypingStore((s) => s.resetTest)

  const isTestRoute = location.pathname === '/'

  useEffect(() => {
    initTest()
  }, [initTest])

  useEffect(() => {
    if (!isTestRoute) return
    if (!isStartedTab || isFinished) return
    const interval = setInterval(tick, 200)
    return () => clearInterval(interval)
  }, [isTestRoute, isStartedTab, isFinished, tick])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.shiftKey || !isStartedTab)) {
        return
      }
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        if (isFinished) resetTest()
      }
      if (e.key === 'Escape') {
        if (isFinished) resetTest()
        navigate('/')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFinished, resetTest, isStartedTab, navigate])

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        'bg-[var(--bg)] text-[var(--text-primary)]'
      )}
    >
      <SkipLink />
      <Header />

      <Breadcrumbs />

      <main id="main-content" className="flex-1 flex flex-col items-center py-4">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="*"
              element={
                <section className="flex flex-col items-center gap-4 py-20">
                  <h1 className="text-4xl font-bold text-[var(--accent)]">404</h1>
                  <p className="text-[var(--text-secondary)]">Page not found</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Go to Typing Test
                  </button>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <SettingsPanel />
      <ShortcutsHelp />
    </div>
  )
}

export default App
