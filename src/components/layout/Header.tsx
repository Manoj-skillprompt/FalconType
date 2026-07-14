import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import { Settings, BarChart3, Trophy, Keyboard, BookOpen, Users } from 'lucide-react'

type TabOption = 'test' | 'dashboard' | 'leaderboard' | 'settings'

interface HeaderProps {
  activeTab: TabOption
  onTabChange: (tab: TabOption) => void
}

const NAV_ITEMS: { key: TabOption; label: string; icon: typeof Keyboard }[] = [
  { key: 'test', label: 'Test', icon: Keyboard },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const setOpen = useSettingsStore(s => s.setOpen)

  return (
    <header className="flex items-center justify-between w-full max-w-[1100px] mx-auto px-4 py-2">
      <div className="flex items-center gap-1 mt-4">
        <span className="text-xl font-bold tracking-tight text-[var(--accent)]">
          FalconType
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-md mt-4 rounded-lg transition-all',
                activeTab === item.key
                  ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
        <button
          onClick={() => setOpen(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-md mt-4 rounded-lg transition-all',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </nav>
    </header>
  )
}
