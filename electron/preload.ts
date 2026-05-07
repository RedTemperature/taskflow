import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Tasks
  getTasks: () => ipcRenderer.invoke('tasks:getAll'),
  saveTasks: (tasks: unknown[]) => ipcRenderer.invoke('tasks:save', tasks),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: unknown) => ipcRenderer.invoke('settings:save', settings),

  // File operations
  exportData: (data: string, format: 'json' | 'csv') =>
    ipcRenderer.invoke('file:export', data, format),
  importData: (format: 'json' | 'csv') => ipcRenderer.invoke('file:import', format)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
