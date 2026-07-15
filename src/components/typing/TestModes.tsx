import { useState, useRef, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTypingStore } from '@/stores/typingStore'
import { cn } from '@/lib/utils'
import type { TestMode, TimeOption, WordOption } from '@/types'

const MODES: TestMode[] = ['time', 'words', 'quote', 'numbers', 'custom']
const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120]
const WORD_OPTIONS: WordOption[] = [25, 50, 100, 120]

export function TestModes() {
  const settings = useSettingsStore(s => s.settings)
  const { mode, time, wordCount, customWordCount, customText } = settings.typing
  const updateTyping = useSettingsStore(s => s.updateTyping)
  const initTest = useTypingStore(s => s.initTest)
  const isStarted = useTypingStore(s => s.isStarted)

  const [customInput, setCustomInput] = useState(String(customWordCount))
  const [customTextInput, setCustomTextInput] = useState(customText)
  const customInputRef = useRef<HTMLInputElement>(null)
  const customTextRef = useRef<HTMLTextAreaElement>(null)

  // Focus the custom word count input when selected
  useEffect(() => {
    if (wordCount === 'custom' && mode === 'words') {
      customInputRef.current?.focus()
    }
  }, [wordCount, mode])

  // Focus textarea when custom mode is selected
  useEffect(() => {
    if (mode === 'custom') {
      customTextRef.current?.focus()
    }
  }, [mode])

  const handleModeChange = (newMode: TestMode) => {
    if (isStarted) return
    updateTyping({ mode: newMode })
    if (newMode !== 'custom') {
      setTimeout(initTest, 0)
    }
  }

  const handleTimeChange = (newTime: TimeOption) => {
    if (isStarted) return
    updateTyping({ time: newTime, wordCount: 25 })
    setTimeout(initTest, 0)
  }

  const handleWordChange = (newCount: WordOption) => {
    if (isStarted) return
    updateTyping({ wordCount: newCount, time: 30 })
    if (newCount !== 'custom') {
      setTimeout(initTest, 0)
    }
  }

  const handleCustomWordSubmit = () => {
    const val = parseInt(customInput, 10)
    if (!isNaN(val) && val >= 1 && val <= 500) {
      updateTyping({ customWordCount: val })
      setTimeout(initTest, 0)
    }
  }

  const handleCustomTextSubmit = () => {
    if (customTextInput.trim().length > 0) {
      updateTyping({ customText: customTextInput.trim() })
      setTimeout(initTest, 0)
    }
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-2 transition-opacity mt-20 duration-200',
      isStarted && 'opacity-0 pointer-events-none'
    )}>
      <div className="flex items-center gap-1">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-all duration-150',
              'hover:text-[var(--text-primary)]',
              mode === m
                ? 'text-[var(--accent)] font-medium'
                : 'text-[var(--text-secondary)]'
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {(mode === 'time' || mode === 'words') && (
        <div className="flex items-center gap-1">
          {mode === 'time' && TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => handleTimeChange(t)}
              className={cn(
                'px-3 py-0.5 text-xs rounded-md transition-all duration-150',
                'hover:text-[var(--text-primary)]',
                time === t
                  ? 'text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)]'
              )}
            >
              {t}
            </button>
          ))}
          {mode === 'words' && WORD_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => handleWordChange(w)}
              className={cn(
                'px-3 py-0.5 text-xs rounded-md transition-all duration-150',
                'hover:text-[var(--text-primary)]',
                wordCount === w
                  ? 'text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)]'
              )}
            >
              {w}
            </button>
          ))}
          {mode === 'words' && (
            <button
              onClick={() => handleWordChange('custom')}
              className={cn(
                'px-3 py-0.5 text-xs rounded-md transition-all duration-150',
                'hover:text-[var(--text-primary)]',
                wordCount === 'custom'
                  ? 'text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)]'
              )}
            >
              custom
            </button>
          )}
        </div>
      )}

      {/* Custom word count input */}
      {mode === 'words' && wordCount === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            ref={customInputRef}
            type="number"
            min={1}
            max={500}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomWordSubmit()
                customInputRef.current?.blur()
              }
              e.stopPropagation()
            }}
            onBlur={handleCustomWordSubmit}
            className={cn(
              'w-20 px-2 py-1 text-xs text-center rounded-md',
              'bg-[var(--bg-card)] border border-[var(--border)]',
              'text-[var(--text-primary)] outline-none',
              'focus:border-[var(--accent)] transition-colors'
            )}
            placeholder="1-500"
          />
          <span className="text-xs text-[var(--text-secondary)]">words</span>
        </div>
      )}

      {/* Custom text textarea */}
      {mode === 'custom' && (
        <div className="flex flex-col items-center gap-2 w-full max-w-[600px]">
          <textarea
            ref={customTextRef}
            value={customTextInput}
            onChange={(e) => setCustomTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleCustomTextSubmit()
                customTextRef.current?.blur()
              }
              e.stopPropagation()
            }}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg resize-none',
              'bg-[var(--bg-card)] border border-[var(--border)]',
              'text-[var(--text-primary)] outline-none',
              'focus:border-[var(--accent)] transition-colors',
              'placeholder:text-[var(--text-secondary)]'
            )}
            rows={3}
            placeholder="Paste or type your custom text here, then press Enter..."
          />
          <button
            onClick={handleCustomTextSubmit}
            className={cn(
              'px-4 py-1 text-xs rounded-md transition-all duration-150',
              'bg-[var(--accent)]/15 text-[var(--accent)]',
              'hover:bg-[var(--accent)]/25',
              customTextInput.trim().length === 0 && 'opacity-50 pointer-events-none'
            )}
          >
            start
          </button>
        </div>
      )}
    </div>
  )
}
