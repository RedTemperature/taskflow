import { AIGenerateResult } from '../../shared/types'

declare global {
  interface Window {
    api: {
      getTasks: () => Promise<unknown[]>
      saveTasks: (tasks: unknown[]) => Promise<boolean>
      getSettings: () => Promise<unknown>
      saveSettings: (settings: unknown) => Promise<boolean>
      exportData: (data: string, format: 'json' | 'csv') => Promise<{ success: boolean; filePath?: string }>
      importData: (format: 'json' | 'csv') => Promise<{ success: boolean; content?: string }>
      generateTasks: (text: string) => Promise<AIGenerateResult>
    }
  }
}
