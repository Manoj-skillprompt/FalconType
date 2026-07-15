import { useHistoryStore } from '@/stores/historyStore'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { BarChart, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Trophy, Zap, Target, Flame, Clock, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, subvalue }: { icon: typeof Trophy; label: string; value: string | number; subvalue?: string }) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-xl',
      'bg-[var(--bg-card)] border border-[var(--border)]'
    )}>
      <div className="p-2 rounded-lg bg-[var(--accent)]/10">
        <Icon size={20} className="text-[var(--accent)]" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold tabular-nums">{value}</p>
        {subvalue && <p className="text-xs text-[var(--text-secondary)]">{subvalue}</p>}
      </div>
    </div>
  )
}

export function Dashboard() {
  const results = useHistoryStore(s => s.results)
  const dailyStats = useHistoryStore(s => s.dailyStats)
  const personalBests = useHistoryStore(s => s.personalBests)
  const achievements = useHistoryStore(s => s.achievements)
  const streak = useHistoryStore(s => s.streak)

  const totalTests = results.length
  const avgWpm = totalTests > 0 ? Math.round(results.reduce((a, r) => a + r.wpm, 0) / totalTests) : 0
  const bestWpm = totalTests > 0 ? Math.max(...results.map(r => r.wpm)) : 0
  const avgAcc = totalTests > 0 ? Math.round(results.reduce((a, r) => a + r.accuracy, 0) / totalTests) : 0
  const totalTime = results.reduce((a, r) => a + r.elapsed, 0)
  const unlockedAchievements = achievements.filter(a => a.unlockedAt)

  const recentResults = results.slice(0, 20).reverse()
  const progressData = recentResults.map((r, i) => ({
    test: i + 1,
    wpm: r.wpm,
    accuracy: r.accuracy,
  }))

  const heatmapData = dailyStats.slice(-28)
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    const dateStr = d.toISOString().split('T')[0]
    const existing = heatmapData.find(s => s.date === dateStr)
    return {
      date: dateStr,
      day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
      count: existing?.testsCompleted ?? 0,
      wpm: existing?.highestWpm ?? 0,
    }
  })

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <section aria-label="Typing statistics overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Zap} label="Average WPM" value={avgWpm} />
          <StatCard icon={Trophy} label="Best WPM" value={bestWpm} />
          <StatCard icon={Target} label="Average Accuracy" value={`${avgAcc}%`} />
          <StatCard icon={Clock} label="Total Time" value={formatTime(Math.floor(totalTime))} />
          <StatCard icon={Flame} label="Current Streak" value={`${streak.current} days`} subvalue={`Best: ${streak.longest} days`} />
          <StatCard icon={TrendingUp} label="Tests Completed" value={totalTests} />
          <StatCard icon={Trophy} label="Personal Bests" value={Object.keys(personalBests).length} />
          <StatCard icon={Target} label="Achievements" value={`${unlockedAchievements.length}/${achievements.length}`} />
        </div>
      </section>

      {/* WPM Progress */}
      {progressData.length > 1 && (
        <section className={cn('p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]')}>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">WPM Progress</h2>
          <div className="h-[200px]" role="img" aria-label="WPM progress chart showing your typing speed over recent tests">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="test" hide />
                <YAxis hide domain={[0, 'dataMax + 20']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="wpm" stroke="var(--accent)" fill="url(#progressGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Activity Heatmap */}
      <section className={cn('p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]')}>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">Activity (28 days)</h2>
        <div className="flex gap-1" role="img" aria-label="Activity heatmap showing typing sessions over the last 28 days">
          {heatmapDays.map((day) => (
            <div
              key={day.date}
              className={cn(
                'w-full aspect-square rounded-sm transition-colors',
                day.count === 0 && 'bg-[var(--border)]/30',
                day.count === 1 && 'bg-[var(--accent)]/30',
                day.count === 2 && 'bg-[var(--accent)]/50',
                day.count >= 3 && 'bg-[var(--accent)]/80',
                day.count >= 5 && 'bg-[var(--accent)]'
              )}
              title={`${day.date}: ${day.count} tests${day.wpm > 0 ? `, ${day.wpm} WPM` : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </section>

      {/* Achievements */}
      {unlockedAchievements.length > 0 && (
        <section className={cn('p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]')}>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </h2>
          <div className="flex flex-wrap gap-2" role="list">
            {achievements.map((a) => (
              <div
                key={a.id}
                role="listitem"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all',
                  a.unlockedAt
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'bg-[var(--border)]/20 text-[var(--text-secondary)] opacity-50'
                )}
                title={a.description}
              >
                <span aria-hidden="true">{a.icon}</span>
                <span>{a.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Results */}
      {results.length > 0 && (
        <section className={cn('p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]')}>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">Recent Tests</h2>
          <div className="space-y-1" role="list">
            {results.slice(0, 10).map((r) => (
              <div key={r.id} role="listitem" className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[var(--accent)] w-12">{r.wpm}wpm</span>
                  <span className="text-[var(--text-secondary)]">{r.accuracy}%</span>
                  <span className="text-[var(--text-secondary)] text-xs">{r.mode}</span>
                </div>
                <time className="text-xs text-[var(--text-secondary)]" dateTime={new Date(r.timestamp).toISOString()}>
                  {new Date(r.timestamp).toLocaleDateString()}
                </time>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internal linking */}
      <section className="text-center text-sm text-[var(--text-secondary)]">
        <Link to="/leaderboard" className="hover:text-[var(--accent)] transition-colors underline underline-offset-2">
          View the global leaderboard &rarr;
        </Link>
      </section>
    </div>
  )
}
