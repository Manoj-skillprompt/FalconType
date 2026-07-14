import { create } from 'zustand'
import type { CharState, Stats, TestResult } from '@/types'
import { generateText } from '@/lib/wordGenerator'
import { generateId } from '@/lib/utils'
import { useSettingsStore } from './settingsStore'

interface TypingStore {
  chars: CharState[]
  currentIndex: number
  isStarted: boolean
  isFinished: boolean
  focus: boolean
  stats: Stats
  timer: number
  startTime: number
  totalWords: number

  initTest: () => void
  handleKeyPress: (key: string) => void
  handleBackspace: () => void
  resetTest: () => void
  tick: () => void
  setFocus: (focus: boolean) => void
}

function createCharStates(text: string): CharState[] {
  return text.split('').map((char, i) => ({
    char,
    typed: null,
    correct: null,
    active: i === 0,
  }))
}

function calculateStats(chars: CharState[], elapsed: number, totalWords: number): Stats {
  const typedChars = chars.filter(c => c.typed !== null)
  const correctChars = chars.filter(c => c.correct === true)
  const incorrectChars = chars.filter(c => c.correct === false)
  const totalTyped = typedChars.length
  const correctCount = correctChars.length
  const incorrectCount = incorrectChars.length

  const elapsedMinutes = elapsed / 60
  const rawWpm = elapsedMinutes > 0 ? Math.round((totalTyped / 5) / elapsedMinutes) : 0
  const wpm = elapsedMinutes > 0 ? Math.round((correctCount / 5) / elapsedMinutes) : 0
  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100

  const words = chars.reduce((acc, c) => {
    if (c.correct === false) acc.incorrect++
    else if (c.char === ' ' && c.correct === true) acc.correct++
    return acc
  }, { correct: 0, incorrect: 0 })

  const distances: number[] = []
  let currentWordCorrect = 0
  let currentWordTotal = 0
  for (const c of typedChars) {
    if (c.char === ' ') {
      if (currentWordTotal > 0) {
        distances.push(currentWordCorrect / currentWordTotal)
      }
      currentWordCorrect = 0
      currentWordTotal = 0
    } else {
      currentWordTotal++
      if (c.correct) currentWordCorrect++
    }
  }
  if (currentWordTotal > 0) {
    distances.push(currentWordCorrect / currentWordTotal)
  }

  const consistency = distances.length > 0
    ? Math.round(100 - (Math.sqrt(distances.reduce((sum, d) => sum + Math.pow(d - (distances.reduce((a, b) => a + b, 0) / distances.length), 2), 0) / distances.length) * 100))
    : 100

  return {
    wpm,
    rawWpm,
    accuracy,
    correctChars: correctCount,
    incorrectChars: incorrectCount,
    missedChars: chars.length - totalTyped - typedChars.filter(c => c.char === ' ' && c.typed === null).length,
    totalChars: chars.length,
    correctWords: words.correct,
    incorrectWords: words.incorrect,
    errorCount: incorrectCount,
    elapsed,
    remaining: 0,
    wpmHistory: [],
    rawWpmHistory: [],
    accuracyHistory: [],
    consistency
  }
}

export const useTypingStore = create<TypingStore>((set, get) => ({
  chars: [],
  currentIndex: 0,
  isStarted: false,
  isFinished: false,
  focus: false,
  stats: {
    wpm: 0, rawWpm: 0, accuracy: 100,
    correctChars: 0, incorrectChars: 0, missedChars: 0,
    totalChars: 0, correctWords: 0, incorrectWords: 0,
    errorCount: 0, consistency: 100,
    elapsed: 0, remaining: 0,
    wpmHistory: [], rawWpmHistory: [], accuracyHistory: [],
  },
  timer: 0,
  startTime: 0,
  totalWords: 0,

  initTest: () => {
    const settings = useSettingsStore.getState().settings.typing
    const wordCount = settings.wordCount === 'custom' ? settings.customWordCount : settings.wordCount
    const count = settings.mode === 'time' ? 200 : (settings.mode === 'words' ? wordCount : 50)
    const text = generateText(settings.mode, count, settings.language, settings.punctuation, settings.numbers, settings.customText)
    const totalWords = text.split(/\s+/).length

    set({
      chars: createCharStates(text),
      currentIndex: 0,
      isStarted: false,
      isFinished: false,
      focus: true,
      timer: settings.mode === 'time' ? settings.time : 0,
      startTime: 0,
      totalWords,
      stats: {
        wpm: 0, rawWpm: 0, accuracy: 100,
        correctChars: 0, incorrectChars: 0, missedChars: 0,
        totalChars: text.length, correctWords: 0, incorrectWords: 0,
        errorCount: 0, consistency: 100,
        elapsed: 0, remaining: settings.mode === 'time' ? settings.time : 0,
        wpmHistory: [], rawWpmHistory: [], accuracyHistory: [],
      },
    })
  },

  handleKeyPress: (key: string) => {
    const state = get()
    if (state.isFinished) return

    const settings = useSettingsStore.getState().settings.typing

    if (!state.isStarted) {
      set({
        isStarted: true,
        startTime: Date.now(),
      })
    }

    const chars = [...state.chars]
    const index = state.currentIndex

    if (index >= chars.length) return

    const isCorrect = key === chars[index].char
    chars[index] = {
      ...chars[index],
      typed: key,
      correct: isCorrect,
      active: false,
    }

    let nextIndex = index + 1
    while (nextIndex < chars.length && chars[nextIndex].typed !== null) {
      nextIndex++
    }
    if (nextIndex < chars.length) {
      chars[nextIndex] = { ...chars[nextIndex], active: true }
    }

    const elapsed = state.startTime > 0 ? (Date.now() - state.startTime) / 1000 : 0
    const newStats = calculateStats(chars, elapsed, state.totalWords)

    const isFinished = nextIndex >= chars.length

    const shouldAddHistory = elapsed > 0

    set({
      chars,
      currentIndex: nextIndex,
      stats: shouldAddHistory ? {
        ...newStats,
        wpmHistory: [...newStats.wpmHistory, newStats.wpm],
        rawWpmHistory: [...newStats.rawWpmHistory, newStats.rawWpm],
        accuracyHistory: [...newStats.accuracyHistory, newStats.accuracy],
      } : newStats,
      isFinished,
      timer: settings.mode === 'time' ? Math.max(0, settings.time - elapsed) : 0,
    })

    if (settings.stopOnError && !isCorrect) {
      return
    }
  },

  handleBackspace: () => {
    const state = get()
    if (state.isFinished || state.currentIndex <= 0) return

    const settings = useSettingsStore.getState().settings.typing
    if (settings.backspace === 'deny') return

    const chars = [...state.chars]
    const index = state.currentIndex

    chars[index - 1] = { ...chars[index - 1], typed: null, correct: null, active: false }
    if (index < chars.length) {
      chars[index] = { ...chars[index], active: false }
    }
    chars[index - 1] = { ...chars[index - 1], active: true }

    const elapsed = state.startTime > 0 ? (Date.now() - state.startTime) / 1000 : 0
    const newStats = calculateStats(chars, elapsed, state.totalWords)

    set({
      chars,
      currentIndex: index - 1,
      stats: newStats,
    })
  },

  tick: () => {
    const state = get()
    if (!state.isStarted || state.isFinished) return

    const settings = useSettingsStore.getState().settings.typing
    const elapsed = (Date.now() - state.startTime) / 1000

    if (settings.mode === 'time') {
      const remaining = Math.max(0, settings.time - elapsed)
      if (remaining <= 0) {
        const finalStats = calculateStats(state.chars, elapsed, state.totalWords)
        set({
          timer: 0,
          isFinished: true,
          stats: finalStats,
        })
        return
      }
      set({ timer: remaining })
    }

    const newStats = calculateStats(state.chars, elapsed, state.totalWords)
    set({
      stats: {
        ...newStats,
        wpmHistory: [...newStats.wpmHistory, newStats.wpm],
        rawWpmHistory: [...newStats.rawWpmHistory, newStats.rawWpm],
        accuracyHistory: [...newStats.accuracyHistory, newStats.accuracy],
      },
    })
  },

  resetTest: () => {
    get().initTest()
  },

  setFocus: (focus) => set({ focus }),
}))
