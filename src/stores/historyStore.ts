import { create } from 'zustand'
import type { TestResult, DailyStats, PersonalBest, Achievements } from '@/types'
import { loadHistory, saveHistory, loadPersonalBests, savePersonalBests, loadDailyStats, updateDailyStats, checkAchievements, updateStreak, loadStreak, loadAchievements } from '@/lib/storage'

interface HistoryStore {
  results: TestResult[]
  personalBests: Record<string, PersonalBest>
  dailyStats: DailyStats[]
  achievements: Achievements[]
  streak: { current: number; longest: number }
  newAchievements: Achievements[]
  showNewAchievements: boolean
  addResult: (result: TestResult) => void
  clearHistory: () => void
  setShowNewAchievements: (show: boolean) => void
}

export const useHistoryStore = create<HistoryStore>((set, get) => {
  const results = loadHistory()
  const personalBests = loadPersonalBests()
  const dailyStats = loadDailyStats()
  const achievements = loadAchievements()
  const streak = loadStreak()

  return {
    results,
    personalBests,
    dailyStats,
    achievements,
    streak: { current: streak.current, longest: streak.longest },
    newAchievements: [],
    showNewAchievements: false,
    addResult: (result: TestResult) => {
      const state = get()
      const newResults = [result, ...state.results]
      saveHistory(newResults)

      updateDailyStats(result)

      const updatedStreak = updateStreak()

      const modeKey = `${result.mode}-${result.elapsed}`
      const existing = state.personalBests[modeKey]
      const pbs = { ...state.personalBests }
      if (!existing || result.wpm > existing.wpm) {
        pbs[modeKey] = { wpm: result.wpm, accuracy: result.accuracy, timestamp: result.timestamp, mode: result.mode }
        savePersonalBests(pbs)
      }

      const newAchievements = checkAchievements(newResults, updatedStreak.current)

      const allAchievements = loadAchievements()

      set({
        results: newResults,
        personalBests: pbs,
        streak: updatedStreak,
        achievements: allAchievements,
        newAchievements,
        showNewAchievements: newAchievements.length > 0,
      })
    },
    clearHistory: () => {
      saveHistory([])
      set({ results: [] })
    },
    setShowNewAchievements: (show) => set({ showNewAchievements: show }),
  }
})
