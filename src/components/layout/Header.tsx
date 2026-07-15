import { NavLink } from 'react-router-dom'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import { Settings, BarChart3, Trophy, Keyboard } from 'lucide-react'

const NAV_ITEMS: { to: string; label: string; icon: typeof Keyboard; end?: boolean }[] = [
  { to: '/', label: 'Test', icon: Keyboard, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export function Header() {
  const setOpen = useSettingsStore((s) => s.setOpen)

  return (
    <header className="flex items-center justify-between w-full max-w-[1100px] mx-auto px-4 py-2" role="banner">
      <div className="flex items-center gap-1 mt-4">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-[var(--accent)] hover:opacity-80 transition-opacity"
          aria-label="FalconType — Go to homepage"
        >
          FalconType
        </NavLink>
      </div>

      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-md mt-4 rounded-lg transition-all',
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          )
        })}
        <button
          onClick={() => setOpen(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-md mt-4 rounded-lg transition-all',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
          aria-label="Open settings"
        >
          <Settings size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </nav>
    </header>
  )
}
