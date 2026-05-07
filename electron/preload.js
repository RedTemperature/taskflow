const { contextBridge, ipcRenderer } = require('electron')

const api = {
  // Tasks
  getTasks: () => ipcRenderer.invoke('tasks:getAll'),
  saveTasks: (tasks) => ipcRenderer.invoke('tasks:save', tasks),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // File operations
  exportData: (data, format) => ipcRenderer.invoke('file:export', data, format),
  importData: (format) => ipcRenderer.invoke('file:import', format)
}

contextBridge.exposeInMainWorld('api', api)
