import { create } from 'zustand'
import type { Settings, TypingSettings, AppearanceSettings, SoundSettings } from '@/types'
import { loadSettings, saveSettings } from '@/lib/storage'

const DEFAULT_TYPING: TypingSettings = {
  mode: 'time',
  time: 30,
  wordCount: 25,
  customWordCount: 50,
  customText: '',
  language: 'english',
  punctuation: false,
  numbers: false,
  stopOnError: false,
  blindMode: false,
  hideTypedWords: false,
  liveWpm: true,
  backspace: 'allow',
}

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'dark',
  accentColor: '#e2b714',
  fontFamily: 'mono',
  fontSize: 24,
}

const DEFAULT_SOUND: SoundSettings = {
  keypress: false,
  error: false,
  volume: 50,
}

const DEFAULT_SETTINGS: Settings = {
  typing: DEFAULT_TYPING,
  appearance: DEFAULT_APPEARANCE,
  sound: DEFAULT_SOUND,
}

interface SettingsStore {
  settings: Settings
  isOpen: boolean
  setOpen: (open: boolean) => void
  updateTyping: (partial: Partial<TypingSettings>) => void
  updateAppearance: (partial: Partial<AppearanceSettings>) => void
  updateSound: (partial: Partial<SoundSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => {
  const saved = loadSettings()

  return {
    settings: saved ?? DEFAULT_SETTINGS,
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
    updateTyping: (partial) =>
      set((state) => {
        const newSettings = {
          ...state.settings,
          typing: { ...state.settings.typing, ...partial },
        }
        saveSettings(newSettings)
        return { settings: newSettings }
      }),
    updateAppearance: (partial) =>
      set((state) => {
        const newSettings = {
          ...state.settings,
          appearance: { ...state.settings.appearance, ...partial },
        }
        saveSettings(newSettings)
        return { settings: newSettings }
      }),
    updateSound: (partial) =>
      set((state) => {
        const newSettings = {
          ...state.settings,
          sound: { ...state.settings.sound, ...partial },
        }
        saveSettings(newSettings)
        return { settings: newSettings }
      }),
    resetSettings: () => {
      saveSettings(DEFAULT_SETTINGS)
      set({ settings: DEFAULT_SETTINGS })
    },
  }
})
