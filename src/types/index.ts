export type TestMode = 'time' | 'words' | 'quote' | 'numbers' | 'custom'
export type TimeOption = 15 | 30 | 60 | 120
export type WordOption = 25 | 50 | 100 |120| 'custom'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Language = 'english' | 'spanish' | 'french' | 'german'

export type Theme = 'dark' | 'light'
export type FontFamily = 'mono' | 'fira' | 'grotesk'

export interface TypingSettings {
  mode: TestMode
  time: TimeOption
  wordCount: WordOption
  customWordCount: number
  customText: string
  language: Language
  punctuation: boolean
  numbers: boolean
  stopOnError: boolean
  confidenceMode: boolean
  blindMode: boolean
  hideTypedWords: boolean
  alwaysCenterCaret: boolean
  smoothScroll: boolean
  liveWpm: boolean
  quickRestart: boolean
  backspace: 'allow' | 'deny'
}

export interface AppearanceSettings {
  theme: Theme
  accentColor: string
  fontFamily: FontFamily
  fontSize: number
}

export interface SoundSettings {
  keypress: boolean
  error: boolean
  volume: number
}

export interface Settings {
  typing: TypingSettings
  appearance: AppearanceSettings
  sound: SoundSettings
}

export interface CharState {
  char: string
  typed: string | null
  correct: boolean | null
  active: boolean
}

export interface TypingState {
  chars: CharState[]
  currentIndex: number
  isStarted: boolean
  isFinished: boolean
  isPaused: boolean
  focus: boolean
}

export interface Stats {
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  missedChars: number
  totalChars: number
  correctWords: number
  incorrectWords: number
  errorCount: number
  consistency: number
  elapsed: number
  remaining: number
  wpmHistory: number[]
  rawWpmHistory: number[]
  accuracyHistory: number[]
}

export interface TestResult {
  id: string
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  correctChars: number
  incorrectChars: number
  missedChars: number
  totalChars: number
  errorCount: number
  correctWords: number
  incorrectWords: number
  elapsed: number
  mode: TestMode
  timestamp: number
  wpmHistory: number[]
  rawWpmHistory: number[]
  accuracyHistory: number[]
}

export interface PersonalBest {
  wpm: number
  accuracy: number
  timestamp: number
  mode: TestMode
}

export interface DailyStats {
  date: string
  testsCompleted: number
  averageWpm: number
  highestWpm: number
  averageAccuracy: number
  totalTime: number
}

export interface Achievements {
  id: string
  name: string
  description: string
  unlockedAt: number | null
  icon: string
}

export type TabOption = 'test' | 'dashboard' | 'leaderboard' | 'settings'
