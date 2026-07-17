import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/ui/SkipLink'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { ShortcutsHelp } from '@/components/ui/ShortcutsHelp'
import { useTypingStore } from '@/stores/typingStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn, clamp } from '@/lib/utils'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

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
  const retryTest = useTypingStore((s) => s.retryTest)
  const appearance = useSettingsStore(s => s.settings.appearance)

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
    const root = document.documentElement
    root.classList.remove('theme-dark', 'theme-light')
    root.classList.add(`theme-${appearance.theme}`)
    root.style.setProperty('--font-size', `${appearance.fontSize}px`)
    root.style.setProperty('--accent', appearance.accentColor)
    root.style.setProperty('--accent-rgb', hexToRgb(appearance.accentColor))
    const fonts: Record<string, string> = {
      mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      fira: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
      grotesk: "'Space Grotesk', 'Inter', 'Segoe UI', sans-serif",
    }
    root.style.setProperty('--font-family', fonts[appearance.fontFamily] || fonts.mono)
  }, [appearance])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useTypingStore.getState()
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        if (state.isFinished) state.retryTest()
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        if (state.isFinished) state.resetTest()
      } else if (e.key === 'Escape') {
        if (state.isStarted && !state.isFinished) {
          e.preventDefault()
          state.stopTest()
        } else if (state.isFinished) {
          state.resetTest()
          navigate('/')
        }
      } else if (e.key === 'AudioVolumeUp') {
        e.preventDefault()
        const { sound } = useSettingsStore.getState().settings
        useSettingsStore.getState().updateSound({ volume: clamp(sound.volume + 5, 0, 100) })
      } else if (e.key === 'AudioVolumeDown') {
        e.preventDefault()
        const { sound } = useSettingsStore.getState().settings
        useSettingsStore.getState().updateSound({ volume: clamp(sound.volume - 5, 0, 100) })
      } else if (e.key === 'AudioVolumeMute') {
        e.preventDefault()
        useSettingsStore.getState().updateSound({ keypress: false, error: false })
      } else if (e.key === ',' && e.ctrlKey) {
        e.preventDefault()
        useSettingsStore.getState().setOpen(!useSettingsStore.getState().isOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

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

      <main id="main-content" className="flex-1 flex flex-col items-center overflow-y-auto min-h-0 py-4">
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
