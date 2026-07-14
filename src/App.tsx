import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { TypingArea } from '@/components/typing/TypingArea'
import { LiveStats } from '@/components/typing/LiveStats'
import { TestModes } from '@/components/typing/TestModes'
import { ResultScreen } from '@/components/result/ResultScreen'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Leaderboard } from '@/components/dashboard/Leaderboard'
import { ShortcutsHelp } from '@/components/ui/ShortcutsHelp'
import { useTypingStore } from '@/stores/typingStore'
import { useHistoryStore } from '@/stores/historyStore'
import { cn } from '@/lib/utils'

type TabOption = 'test' | 'dashboard' | 'leaderboard' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<TabOption>('test')
  const isStarted = useTypingStore(s => s.isStarted)
  const isFinished = useTypingStore(s => s.isFinished)
  const resetTest = useTypingStore(s => s.resetTest)
  const tick = useTypingStore(s => s.tick)
  const initTest = useTypingStore(s => s.initTest)
  const isStartedTab = useTypingStore(s => s.isStarted)

  const showNewAchievements = useHistoryStore(s => s.showNewAchievements)
  const newAchievements = useHistoryStore(s => s.newAchievements)
  const setShowNewAchievements = useHistoryStore(s => s.setShowNewAchievements)

  useEffect(() => {
    initTest()
  }, [initTest])

  useEffect(() => {
    if (!isStarted || isFinished) return
    const interval = setInterval(tick, 200)
    return () => clearInterval(interval)
  }, [isStarted, isFinished, tick])

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
        setActiveTab('test')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFinished, resetTest, isStartedTab])

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      'bg-[var(--bg)] text-[var(--text-primary)]'
    )}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col items-center mt-46 py-4">
        {activeTab === 'test' && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <TestModes />
            {!isFinished && <TypingArea />}
            {!isFinished && <LiveStats />}
            {isFinished && <ResultScreen />}
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </main>

      <SettingsPanel />
      <ShortcutsHelp />

      {showNewAchievements && newAchievements.length > 0 && (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'px-4 py-3 rounded-xl',
          'bg-[var(--bg-card)] border border-[var(--border)] shadow-xl',
          'animate-slideUp'
        )}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{newAchievements[0].icon}</span>
            <div>
              <p className="text-sm font-medium">Achievement Unlocked!</p>
              <p className="text-xs text-[var(--text-secondary)]">{newAchievements[0].name}: {newAchievements[0].description}</p>
            </div>
            <button
              onClick={() => setShowNewAchievements(false)}
              className="ml-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
