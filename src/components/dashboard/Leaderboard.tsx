import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useHistoryStore } from '@/stores/historyStore'
import { Link } from 'react-router-dom'
import { Trophy, Medal, Users, Clock, Globe } from 'lucide-react'

type LeaderboardFilter = 'global' | 'friends' | 'weekly' | 'monthly' | 'alltime'

const FILTERS: { key: LeaderboardFilter; label: string; icon: typeof Trophy }[] = [
  { key: 'global', label: 'Global', icon: Globe },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'weekly', label: 'Weekly', icon: Clock },
  { key: 'monthly', label: 'Monthly', icon: Medal },
  { key: 'alltime', label: 'All Time', icon: Trophy },
]

function getRankBadge(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

export function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState<LeaderboardFilter>('global')
  const results = useHistoryStore(s => s.results)

  const bestResult = results.length > 0
    ? results.reduce((best, r) => r.wpm > best.wpm ? r : best, results[0])
    : null

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Filters */}
      <div className="flex items-center justify-center gap-1" role="tablist" aria-label="Leaderboard filter">
        {FILTERS.map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                activeFilter === f.key
                  ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} aria-hidden="true" />
              {f.label}
            </button>
          )
        })}
      </div>

      {/* User's best */}
      {bestResult && (
        <div className={cn(
          'p-4 rounded-xl border border-dashed',
          'bg-[var(--accent)]/5 border-[var(--accent)]/30'
        )}>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Your Best</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-[var(--accent)]">{bestResult.wpm} wpm</span>
            <span className="text-sm text-[var(--text-secondary)]">{bestResult.accuracy}% acc</span>
            <span className="text-xs text-[var(--text-secondary)]">{bestResult.mode}</span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <section className={cn('rounded-xl border border-[var(--border)] overflow-hidden')} aria-label="Leaderboard rankings">
        <div className="p-8 text-center">
          <Trophy size={40} className="mx-auto mb-3 text-[var(--text-secondary)] opacity-40" />
          <p className="text-sm text-[var(--text-secondary)]">Leaderboard coming soon</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-60">Complete typing tests to compete with others</p>
        </div>
      </section>

      {/* Internal linking */}
      <div className="text-center text-sm text-[var(--text-secondary)]">
        <Link to="/" className="hover:text-[var(--accent)] transition-colors underline underline-offset-2">
          Take a typing test &rarr;
        </Link>
      </div>
    </div>
  )
}
