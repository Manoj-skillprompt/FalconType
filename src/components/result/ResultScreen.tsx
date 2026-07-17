import { useEffect, useRef, useMemo } from 'react'
import { useTypingStore } from '@/stores/typingStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { generateId } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { cn } from '@/lib/utils'
import type { TestResult } from '@/types'
import { getQuoteAuthor } from '@/lib/wordGenerator'

export function ResultScreen() {
  const savedRef = useRef(false)
  const stats = useTypingStore(s => s.stats)
  const chars = useTypingStore(s => s.chars)
  const isFinished = useTypingStore(s => s.isFinished)
  const resetTest = useTypingStore(s => s.resetTest)
  const retryTest = useTypingStore(s => s.retryTest)
  const addResult = useHistoryStore(s => s.addResult)
  const personalBests = useHistoryStore(s => s.personalBests)
  const settings = useSettingsStore(s => s.settings)

  // Reset the saved guard when a new test starts
  useEffect(() => {
    if (!isFinished) {
      savedRef.current = false
    }
  }, [isFinished])

  const result: TestResult = useMemo(() => ({
    id: generateId(),
    wpm: stats.wpm,
    rawWpm: stats.rawWpm,
    accuracy: stats.accuracy,
    consistency: stats.consistency,
    correctChars: stats.correctChars,
    incorrectChars: stats.incorrectChars,
    missedChars: stats.missedChars,
    totalChars: stats.totalChars,
    errorCount: stats.errorCount,
    correctWords: stats.correctWords,
    incorrectWords: stats.incorrectWords,
    elapsed: stats.elapsed,
    mode: settings.typing.mode,
    timestamp: Date.now(),
    wpmHistory: stats.wpmHistory,
    rawWpmHistory: stats.rawWpmHistory,
    accuracyHistory: stats.accuracyHistory,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isFinished])

  useEffect(() => {
    if (isFinished && !savedRef.current) {
      savedRef.current = true
      addResult(result)
    }
  }, [isFinished, result, addResult])

  if (!isFinished) return null

  const chartData = stats.wpmHistory.map((wpm, i) => ({
    time: i,
    wpm,
    raw: stats.rawWpmHistory[i] ?? 0,
    accuracy: stats.accuracyHistory[i] ?? 0,
  }))

  const modeKey = `${result.mode}-${result.elapsed}`
  const pb = personalBests[modeKey]
  const isPb = pb ? result.wpm >= pb.wpm : false

  const mainStats = [
    { label: 'wpm', value: result.wpm, suffix: isPb ? 'pb!' : undefined },
    { label: 'accuracy', value: `${result.accuracy}%` },
    { label: 'raw wpm', value: result.rawWpm },
    { label: 'consistency', value: `${result.consistency}%` },
  ]

  const detailStats = [
    { label: 'characters', value: `${result.correctChars}/${result.incorrectChars}/${result.missedChars}`, hint: 'correct/incorrect/missed' },
    { label: 'errors', value: result.errorCount },
    { label: 'words', value: `${result.correctWords}/${result.incorrectWords}`, hint: 'correct/incorrect' },
    { label: 'time', value: `${result.elapsed.toFixed(1)}s` },
  ]

  const quoteAuthor = getQuoteAuthor(
    chars.map(c => c.char).join('')
  )

  return (
    <section className="w-full max-w-[900px] mx-auto px-4 animate-fadeIn" aria-label="Test results">
      <div className="flex flex-col items-center gap-8">
        {/* Main Stats */}
        <div className="flex items-center gap-8 justify-center flex-wrap" role="list">
          {mainStats.map((stat) => (
            <div key={stat.label} role="listitem" className="flex flex-col items-center">
              <span className="text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                {stat.label}
              </span>
              <span className="text-4xl font-bold font-mono tabular-nums text-[var(--accent)]">
                {stat.value}
              </span>
              {/* {stat.suffix && (
                <span className="text-xs text-green-500 font-medium">personal best!</span>
              )} */}
            </div>
          ))}
        </div>

        {/* Detail Stats */}
        <div className="flex items-center gap-6 justify-center flex-wrap text-sm">
          {detailStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5" title={stat.hint}>
              <span className="text-[var(--text-secondary)] text-xs uppercase">{stat.label}</span>
              <span className="font-mono font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Quote Author */}
        {quoteAuthor && (
          <p className="text-[var(--text-secondary)] italic text-sm">
            &mdash; {quoteAuthor}
          </p>
        )}

        {/* Chart */}
        {chartData.length > 2 && (
          <div className="w-full h-[200px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'dataMax + 20']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                  labelFormatter={(v) => `${v}s`}
                />
                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke="var(--accent)"
                  fill="url(#wpmGradient)"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
                <Line
                  type="monotone"
                  dataKey="raw"
                  stroke="var(--text-secondary)"
                  strokeWidth={1}
                  dot={false}
                  opacity={0.4}
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={resetTest}
              className={cn(
                'px-6 py-2 rounded-lg font-medium text-sm',
                'bg-[var(--accent)] text-[var(--bg)]',
                'hover:opacity-90 transition-opacity',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]'
              )}
            >
              Next Test
            </button>
            <div className="flex items-center gap-1">
              <kbd className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono rounded',
                'bg-[var(--bg-card)] border border-[var(--border)]',
                'text-[var(--text-secondary)]'
              )}>Ctrl</kbd>
              <span className="text-[10px] text-[var(--text-secondary)]">+</span>
              <kbd className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono rounded',
                'bg-[var(--bg-card)] border border-[var(--border)]',
                'text-[var(--text-secondary)]'
              )}>Enter</kbd>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={retryTest}
              className={cn(
                'px-6 py-2 rounded-lg font-medium text-sm',
                'border border-[var(--border)] text-[var(--text-secondary)]',
                'hover:bg-[var(--bg-card)] transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]'
              )}
            >
              Retry
            </button>
            <div className="flex items-center gap-1">
              <kbd className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono rounded',
                'bg-[var(--bg-card)] border border-[var(--border)]',
                'text-[var(--text-secondary)]'
              )}>Shift</kbd>
              <span className="text-[10px] text-[var(--text-secondary)]">+</span>
              <kbd className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono rounded',
                'bg-[var(--bg-card)] border border-[var(--border)]',
                'text-[var(--text-secondary)]'
              )}>Enter</kbd>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
