import { useTypingStore } from '@/stores/typingStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'

export function LiveStats() {
  const stats = useTypingStore(s => s.stats)
  const isStarted = useTypingStore(s => s.isStarted)
  const timer = useTypingStore(s => s.timer)
  const isFinished = useTypingStore(s => s.isFinished)
  const settings = useSettingsStore(s => s.settings)
  const { mode, time } = settings.typing
  const { liveWpm } = settings.typing

  const statItems = [
    { label: 'wpm', value: stats.wpm },
    { label: 'acc', value: `${stats.accuracy}%` },
  ]

  if (liveWpm) {
    statItems.push({ label: 'raw', value: stats.rawWpm })
  }

  if (mode === 'time') {
    statItems.push({ label: 'time', value: formatTime(Math.ceil(timer)) })
  } else {
    statItems.push({ label: 'time', value: formatTime(Math.floor(stats.elapsed)) })
  }

  statItems.push(
    { label: 'chars', value: `${stats.correctChars}/${stats.incorrectChars}` }
  )

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-5 px-4 py-2 text-sm',
        'transition-opacity duration-300',
        (isStarted || isFinished) ? 'opacity-100' : 'opacity-30'
      )}
    >
      {statItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">
            {item.label}
          </span>
          <span className="font-mono text-base font-bold tabular-nums text-[var(--accent)]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
