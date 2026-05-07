import Store from 'electron-store'

interface TaskStore {
  tasks: unknown[]
  settings: {
    theme: 'light' | 'dark' | 'system'
    language: 'zh-CN' | 'en-US'
    defaultView: 'list' | 'board'
    showCompletedTasks: boolean
  }
}

const defaults: TaskStore = {
  tasks: [],
  settings: {
    theme: 'system',
    language: 'zh-CN',
    defaultView: 'list',
    showCompletedTasks: true
  }
}

const store = new Store<TaskStore>({
  name: 'taskflow-data',
  defaults
})

export function getTasks(): unknown[] {
  return store.get('tasks', [])
}

export function saveTasks(tasks: unknown[]): void {
  store.set('tasks', tasks)
}

export function getSettings(): TaskStore['settings'] {
  return store.get('settings', defaults.settings)
}

export function saveSettings(settings: TaskStore['settings']): void {
  store.set('settings', settings)
}
