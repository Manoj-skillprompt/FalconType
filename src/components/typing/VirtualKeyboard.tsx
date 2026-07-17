import { useEffect, useRef } from 'react'
import { useTypingStore } from '@/stores/typingStore'
import { cn } from '@/lib/utils'

const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
]

const SPACE_KEY = ' '

function charToKey(char: string): string {
  if (char === ' ') return SPACE_KEY
  return char.toLowerCase()
}

export function VirtualKeyboard() {
  const chars = useTypingStore(s => s.chars)
  const currentIndex = useTypingStore(s => s.currentIndex)
  const lastPressedKey = useTypingStore(s => s.lastPressedKey)
  const lastPressedCorrect = useTypingStore(s => s.lastPressedCorrect)
  const isStarted = useTypingStore(s => s.isStarted)
  const isFinished = useTypingStore(s => s.isFinished)
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (clearRef.current) clearTimeout(clearRef.current)
    }
  }, [])

  useEffect(() => {
    if (lastPressedKey && !isFinished) {
      if (clearRef.current) clearTimeout(clearRef.current)
      clearRef.current = setTimeout(() => {
        useTypingStore.setState({ lastPressedKey: null })
      }, 300)
    }
  }, [lastPressedKey, isFinished])

  const nextChar = currentIndex < chars.length ? chars[currentIndex].char : null
  const nextKey = nextChar ? charToKey(nextChar) : null

  const pressedKey = lastPressedKey ? charToKey(lastPressedKey) : null
  const pressedCorrect = lastPressedCorrect

  const getKeyState = (key: string): 'idle' | 'next' | 'pressed-correct' | 'pressed-incorrect' => {
    if (pressedKey && key === pressedKey && !isFinished && isStarted) {
      return pressedCorrect ? 'pressed-correct' : 'pressed-incorrect'
    }
    if (nextKey && key === nextKey && !isFinished) {
      return 'next'
    }
    return 'idle'
  }

  const stateClasses: Record<string, string> = {
    idle: 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)]',
    next: 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/40 scale-105',
    'pressed-correct': 'bg-[var(--text-correct)]/20 text-[var(--text-correct)] border-[var(--text-correct)]/40',
    'pressed-incorrect': 'bg-[var(--text-incorrect)]/20 text-[var(--text-incorrect)] border-[var(--text-incorrect)]/40',
  }

  const renderKey = (key: string, wide?: boolean) => {
    const state = getKeyState(key)
    return (
      <div
        key={key}
        className={cn(
          'flex items-center justify-center rounded-md border select-none',
          'text-sm font-mono font-medium',
          'transition-all duration-150 ease-out',
          wide ? 'w-[12em]' : 'w-[3.6em]',
          'h-[3.6em]',
          stateClasses[state],
        )}
      >
        {key === SPACE_KEY ? '' : key}
      </div>
    )
  }

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 select-none mt-6">
      <div className="flex flex-col items-center gap-1.5">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5" style={{ paddingLeft: ri * 22 }}>
            {row.map(k => renderKey(k))}
          </div>
        ))}
        <div className="flex gap-1.5">
          {renderKey(SPACE_KEY, true)}
        </div>
      </div>
    </div>
  )
}
