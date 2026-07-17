import { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTypingStore } from '@/stores/typingStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn, formatTime } from '@/lib/utils'

const VIEWPORT_PAD = 60

export function TypingArea() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isIdle, setIsIdle] = useState(true)

  const chars = useTypingStore(s => s.chars)
  const currentIndex = useTypingStore(s => s.currentIndex)
  const isFinished = useTypingStore(s => s.isFinished)
  const focus = useTypingStore(s => s.focus)
  const handleKeyPress = useTypingStore(s => s.handleKeyPress)
  const handleBackspace = useTypingStore(s => s.handleBackspace)
  const setFocus = useTypingStore(s => s.setFocus)
  const timer = useTypingStore(s => s.timer)
  const isStarted = useTypingStore(s => s.isStarted)

  const settings = useSettingsStore(s => s.settings)
  const { blindMode, hideTypedWords, mode } = settings.typing

  const caretClasses = cn(
    'inline-block w-[2px] h-[1.2em] -ml-[1px]',
    'transition-all duration-[80ms] ease-out',
    isIdle && 'caret-blink',
    'bg-[var(--accent)]'
  )

  useLayoutEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) return

    const active = wrapper.querySelector<HTMLElement>('[data-active="true"]')

    const ch = container.clientHeight
    const wh = wrapper.scrollHeight

    if (!active || wh <= ch) {
      const y = wh <= ch ? (ch - wh) / 2 : 0
      wrapper.style.transform = `translateY(${y}px)`
      return
    }

    const top = active.offsetTop
    const h = active.offsetHeight
    const targetY = ch / 2 - top - h / 2
    const minY = -(wh - ch)
    const clampedY = Math.max(minY, Math.min(0, targetY))

    wrapper.style.transform = `translateY(${clampedY}px)`
  }, [currentIndex, chars])

  useEffect(() => {
    if (isFinished) return

    const handler = (e: KeyboardEvent) => {
      if (!focus && e.key !== 'Tab') return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Tab') {
        e.preventDefault()
        return
      }

      // Stop blinking immediately on keypress, restart idle timer
      setIsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 500)

      if (e.key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
        return
      }
      if (e.key.length === 1) {
        e.preventDefault()
        handleKeyPress(e.key)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focus, isFinished, handleKeyPress, handleBackspace])

  const displayWords = useMemo(() => {
    if (chars.length === 0) return []

    const words = chars.reduce<{ chars: typeof chars; wordIndex: number }[]>((acc, c, i) => {
      if (c.char === ' ' || i === 0) {
        const start = c.char === ' ' ? i + 1 : i
        const end = chars.slice(start).findIndex(x => x.char === ' ') + start
        const wordChars = end >= start ? chars.slice(start, end === start ? start + 1 : end) : chars.slice(start)
        acc.push({ chars: wordChars, wordIndex: acc.length })
      }
      return acc
    }, [])

    if (!hideTypedWords) return words

    const firstUntyped = chars.findIndex(c => c.typed === null)
    const untypedStart = firstUntyped >= 0 ? firstUntyped : chars.length
    return chars.slice(untypedStart).reduce<{ chars: typeof chars; wordIndex: number }[]>((acc, c, i) => {
      if (c.char === ' ' || i === 0) {
        const start = c.char === ' ' ? i + untypedStart + 1 : i + untypedStart
        const wordChars: typeof chars = []
        for (let j = start; j < chars.length; j++) {
          if (chars[j].char === ' ' && wordChars.length > 0) break
          wordChars.push(chars[j])
        }
        acc.push({ chars: wordChars, wordIndex: acc.length })
      }
      return acc
    }, [])
  }, [chars, hideTypedWords])

  if (chars.length === 0) return null

  return (
    <div className="flex flex-col items-center w-full">
      {mode === 'time' && (
        <div className={cn(
          'mb-3 font-mono font-bold tabular-nums select-none',
          'text-4xl tracking-tight',
          'transition-colors duration-200',
          timer <= 5 && isStarted ? 'text-[var(--text-incorrect)]' : 'text-[var(--accent)]'
        )}>
          {formatTime(Math.ceil(timer))}
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          'typing-viewport relative w-full max-w-[1100px] mx-auto',
          'px-4 rounded-xl select-none',
          'focus:outline-none'
        )}
        onClick={() => setFocus(true)}
        role="textbox"
        tabIndex={0}
        aria-label="Typing area"
      >
        <div
          ref={wrapperRef}
          className="typing-wrapper flex flex-wrap"
          style={{ paddingTop: VIEWPORT_PAD, paddingBottom: VIEWPORT_PAD }}
        >
          {displayWords.map((word, wi) => {
            const wordStart = chars.indexOf(word.chars[0])
            const wordEnd = wordStart + word.chars.length
            const isCurrentWord = currentIndex >= wordStart && currentIndex < wordEnd
            // Space after this word (not rendered as a char span)
            const isSpaceActive = currentIndex === wordEnd && chars[wordEnd]?.char === ' '

            return (
              <span key={wi} className={cn('word-group', isCurrentWord && 'current-word')}>
                {word.chars.map((char, ci) => {
                  const globalIndex = wordStart + ci
                  const isActive = globalIndex === currentIndex
                  const isCorrect = char.correct === true
                  const isIncorrect = char.correct === false
                  const isUntyped = char.typed === null

                  if (blindMode && isCorrect) {
                    return <span key={ci} className="opacity-0">a</span>
                  }

                  return (
                    <span
                      key={ci}
                      data-active={isActive}
                      data-index={globalIndex}
                      className={cn(
                        'char',
                        isActive && 'active-char',
                        isCorrect && 'text-[var(--text-correct)]',
                        isIncorrect && 'text-[var(--text-incorrect)]',
                        isIncorrect && 'underline decoration-[var(--text-incorrect)] decoration-2 underline-offset-2',
                        isUntyped && 'text-[var(--text-untyped)]',
                        char.char === ' ' && 'w-[0.3em]',
                        char.char === ' ' && isActive && 'inline-block'
                      )}
                    >
                      {char.char === ' ' ? '\u00A0' : char.char}
                      {isActive && (
                        <span className={cn(caretClasses, 'absolute top-1/2 -translate-y-1/2 left-0')} />
                      )}
                    </span>
                  )
                })}
                {/* Caret for the space between words (space chars are not rendered as DOM nodes) */}
                {isSpaceActive && (
                  <span
                    data-active="true"
                    data-index={wordEnd}
                    className="relative inline-block w-0"
                  >
                    <span className={cn(caretClasses, 'absolute top-1/2 -translate-y-1/2 left-0')} />
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
