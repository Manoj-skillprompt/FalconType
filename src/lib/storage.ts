import type { Settings, TestResult, DailyStats, PersonalBest, Achievements } from '@/types'
import { getDateString } from './utils'

const SETTINGS_KEY = 'falcontype_settings'
const HISTORY_KEY = 'falcontype_history'
const DAILY_KEY = 'falcontype_daily'
const PB_KEY = 'falcontype_personal_bests'
const ACHIEVEMENTS_KEY = 'falcontype_achievements'
const STREAK_KEY = 'falcontype_streak'

export function loadSettings(): Settings | null {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

export function loadHistory(): TestResult[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveHistory(results: TestResult[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(results.slice(-500)))
  } catch {
    try {
      const limited = results.slice(-200)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limited))
    } catch {}
  }
}

export function loadPersonalBests(): Record<string, PersonalBest> {
  try {
    const data = localStorage.getItem(PB_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function savePersonalBests(pbs: Record<string, PersonalBest>): void {
  try {
    localStorage.setItem(PB_KEY, JSON.stringify(pbs))
  } catch {}
}

export function loadDailyStats(): DailyStats[] {
  try {
    const data = localStorage.getItem(DAILY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveDailyStats(stats: DailyStats[]): void {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(stats))
  } catch {}
}

export function updateDailyStats(result: TestResult): void {
  const stats = loadDailyStats()
  const today = getDateString(new Date(result.timestamp))
  const existing = stats.find(s => s.date === today)

  if (existing) {
    existing.testsCompleted++
    existing.averageWpm = (existing.averageWpm * (existing.testsCompleted - 1) + result.wpm) / existing.testsCompleted
    existing.highestWpm = Math.max(existing.highestWpm, result.wpm)
    existing.averageAccuracy = (existing.averageAccuracy * (existing.testsCompleted - 1) + result.accuracy) / existing.testsCompleted
    existing.totalTime += result.elapsed
  } else {
    stats.push({
      date: today,
      testsCompleted: 1,
      averageWpm: result.wpm,
      highestWpm: result.wpm,
      averageAccuracy: result.accuracy,
      totalTime: result.elapsed,
    })
  }

  saveDailyStats(stats.slice(-90))
}

export function loadStreak(): { current: number; longest: number; lastDate: string | null } {
  try {
    const data = localStorage.getItem(STREAK_KEY)
    return data ? JSON.parse(data) : { current: 0, longest: 0, lastDate: null }
  } catch {
    return { current: 0, longest: 0, lastDate: null }
  }
}

export function updateStreak(): { current: number; longest: number } {
  const streak = loadStreak()
  const today = getDateString()
  const yesterday = getDateString(new Date(Date.now() - 86400000))

  if (streak.lastDate === today) return { current: streak.current, longest: streak.longest }

  if (streak.lastDate === yesterday) {
    streak.current++
  } else if (streak.lastDate !== today) {
    streak.current = 1
  }

  streak.longest = Math.max(streak.longest, streak.current)
  streak.lastDate = today
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak))

  return { current: streak.current, longest: streak.longest }
}

export const ACHIEVEMENTS_LIST: Achievements[] = [
  { id: 'first_test', name: 'First Steps', description: 'Complete your first typing test', unlockedAt: null, icon: '🎯' },
  { id: 'speed_50', name: 'Speed Demon', description: 'Reach 50 WPM', unlockedAt: null, icon: '⚡' },
  { id: 'speed_75', name: 'Fast Fingers', description: 'Reach 75 WPM', unlockedAt: null, icon: '🔥' },
  { id: 'speed_100', name: 'Century', description: 'Reach 100 WPM', unlockedAt: null, icon: '💯' },
  { id: 'speed_120', name: 'Unstoppable', description: 'Reach 120 WPM', unlockedAt: null, icon: '🚀' },
  { id: 'accuracy_95', name: 'Precise', description: 'Complete a test with 95%+ accuracy', unlockedAt: null, icon: '🎯' },
  { id: 'accuracy_100', name: 'Perfect', description: 'Complete a test with 100% accuracy', unlockedAt: null, icon: '💎' },
  { id: 'streak_3', name: 'Consistent', description: 'Maintain a 3-day streak', unlockedAt: null, icon: '📅' },
  { id: 'streak_7', name: 'Dedicated', description: 'Maintain a 7-day streak', unlockedAt: null, icon: '📅' },
  { id: 'streak_30', name: 'Committed', description: 'Maintain a 30-day streak', unlockedAt: null, icon: '🔥' },
  { id: 'tests_10', name: 'Getting Started', description: 'Complete 10 tests', unlockedAt: null, icon: '📝' },
  { id: 'tests_50', name: 'Practiced', description: 'Complete 50 tests', unlockedAt: null, icon: '📝' },
  { id: 'tests_100', name: 'Experienced', description: 'Complete 100 tests', unlockedAt: null, icon: '🏆' },
  { id: 'time_15', name: 'Sprint', description: 'Complete a 15-second test', unlockedAt: null, icon: '⏱️' },
  { id: 'time_120', name: 'Marathon', description: 'Complete a 120-second test', unlockedAt: null, icon: '🏃' },
]

export function checkAchievements(results: TestResult[], streak: number): Achievements[] {
  const completed = loadAchievements()
  const newAchievements: Achievements[] = []
  const now = Date.now()

  for (const achievement of ACHIEVEMENTS_LIST) {
    if (completed.find(a => a.id === achievement.id)?.unlockedAt) continue

    let unlock = false
    const speedRecords = results.filter(r => r.wpm >= 0)

    switch (achievement.id) {
      case 'first_test':
        unlock = results.length >= 1
        break
      case 'speed_50':
        unlock = speedRecords.some(r => r.wpm >= 50)
        break
      case 'speed_75':
        unlock = speedRecords.some(r => r.wpm >= 75)
        break
      case 'speed_100':
        unlock = speedRecords.some(r => r.wpm >= 100)
        break
      case 'speed_120':
        unlock = speedRecords.some(r => r.wpm >= 120)
        break
      case 'accuracy_95':
        unlock = speedRecords.some(r => r.accuracy >= 95)
        break
      case 'accuracy_100':
        unlock = speedRecords.some(r => r.accuracy >= 100)
        break
      case 'streak_3':
        unlock = streak >= 3
        break
      case 'streak_7':
        unlock = streak >= 7
        break
      case 'streak_30':
        unlock = streak >= 30
        break
      case 'tests_10':
        unlock = results.length >= 10
        break
      case 'tests_50':
        unlock = results.length >= 50
        break
      case 'tests_100':
        unlock = results.length >= 100
        break
      case 'time_15':
        unlock = speedRecords.some(r => r.mode === 'time' && r.elapsed <= 15)
        break
      case 'time_120':
        unlock = speedRecords.some(r => r.mode === 'time' && r.elapsed >= 115)
        break
    }

    if (unlock) {
      newAchievements.push({ ...achievement, unlockedAt: now })
    }
  }

  if (newAchievements.length > 0) {
    const unlocked: Achievements[] = [...completed.filter(a => a.unlockedAt), ...newAchievements]
    const all: Achievements[] = unlocked.concat(
      ACHIEVEMENTS_LIST.filter(a => !unlocked.find((x: Achievements) => x.id === a.id))
    )
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(all))
  }

  return newAchievements
}

export function loadAchievements(): Achievements[] {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY)
    return data ? JSON.parse(data) : ACHIEVEMENTS_LIST.map(a => ({ ...a }))
  } catch {
    return ACHIEVEMENTS_LIST.map(a => ({ ...a }))
  }
}
