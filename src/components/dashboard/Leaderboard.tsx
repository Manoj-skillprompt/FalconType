import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useHistoryStore } from '@/stores/historyStore'
import { Trophy, Medal, Users, Clock, Globe } from 'lucide-react'

type LeaderboardFilter = 'global' | 'friends' | 'weekly' | 'monthly' | 'alltime'

const FILTERS: { key: LeaderboardFilter; label: string; icon: typeof Trophy }[] = [
  { key: 'global', label: 'Global', icon: Globe },
  { key: 'friends', label: 'Friends', icon: Users },
  { key: 'weekly', label: 'Weekly', icon: Clock },
  { key: 'monthly', label: 'Monthly', icon: Medal },
  { key: 'alltime', label: 'All Time', icon: Trophy },
]

// Placeholder data for the leaderboard
const MOCK_ENTRIES = [
  { rank: 1, name: 'TypeMaster', wpm: 152, accuracy: 98, tests: 1240 },
  { rank: 2, name: 'SpeedDev', wpm: 148, accuracy: 97, tests: 892 },
  { rank: 3, name: 'KeyNinja', wpm: 145, accuracy: 96, tests: 2104 },
  { rank: 4, name: 'FingerStorm', wpm: 141, accuracy: 95, tests: 567 },
  { rank: 5, name: 'CodeRacer', wpm: 139, accuracy: 97, tests: 1567 },
  { rank: 6, name: 'ByteWriter', wpm: 136, accuracy: 94, tests: 723 },
  { rank: 7, name: 'SwiftType', wpm: 133, accuracy: 96, tests: 1890 },
  { rank: 8, name: 'DataFlow', wpm: 130, accuracy: 93, tests: 456 },
  { rank: 9, name: 'TextWizard', wpm: 128, accuracy: 95, tests: 2345 },
  { rank: 10, name: 'QuickStroke', wpm: 125, accuracy: 94, tests: 678 },
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
  const personalBests = useHistoryStore(s => s.personalBests)

  const bestResult = results.length > 0
    ? results.reduce((best, r) => r.wpm > best.wpm ? r : best, results[0])
    : null

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Filters */}
      <div className="flex items-center justify-center gap-1">
        {FILTERS.map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                activeFilter === f.key
                  ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} />
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
      <div className={cn('rounded-xl border border-[var(--border)] overflow-hidden')}>
        <div className="divide-y divide-[var(--border)]">
          {MOCK_ENTRIES.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center justify-between px-4 py-3',
                'hover:bg-[var(--bg-card)] transition-colors'
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center text-lg">{getRankBadge(entry.rank)}</span>
                <div>
                  <p className="font-medium text-sm">{entry.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{entry.tests.toLocaleString()} tests</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold tabular-nums text-[var(--accent)]">{entry.wpm}</p>
                  <p className="text-xs text-[var(--text-secondary)]">wpm</p>
                </div>
                <div className="text-right w-14">
                  <p className="font-medium text-sm">{entry.accuracy}%</p>
                  <p className="text-xs text-[var(--text-secondary)]">acc</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
