import { create } from 'zustand'
import { Settings } from '../../shared/types'

interface SettingsState {
  settings: Settings
  isLoading: boolean

  setSettings: (settings: Partial<Settings>) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'zh-CN',
  defaultView: 'list',
  showCompletedTasks: true
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,

  setSettings: (updates) => {
    const state = get()
    const newSettings = { ...state.settings, ...updates }
    set({ settings: newSettings })
    get().saveSettings()
  },

  loadSettings: async () => {
    set({ isLoading: true })
    try {
      const settings = await window.api.getSettings()
      set({ settings: (settings as Settings) || defaultSettings, isLoading: false })
    } catch (error) {
      console.error('Failed to load settings:', error)
      set({ isLoading: false })
    }
  },

  saveSettings: async () => {
    const { settings } = get()
    try {
      await window.api.saveSettings(settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }
}))
