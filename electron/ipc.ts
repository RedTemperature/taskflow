import { ipcMain, BrowserWindow, dialog } from 'electron'
import { getTasks, saveTasks, getSettings, saveSettings } from './store'
import { readFileSync, writeFileSync } from 'fs'

export function setupIpcHandlers(_mainWindow: BrowserWindow): void {
  // Tasks
  ipcMain.handle('tasks:getAll', () => {
    return getTasks()
  })

  ipcMain.handle('tasks:save', (_, tasks: unknown[]) => {
    saveTasks(tasks)
    return true
  })

  // Settings
  ipcMain.handle('settings:get', () => {
    return getSettings()
  })

  ipcMain.handle('settings:save', (_, settings: unknown) => {
    saveSettings(settings as Parameters<typeof saveSettings>[0])
    return true
  })

  // File export
  ipcMain.handle('file:export', async (_, data: string, format: 'json' | 'csv') => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: `Export as ${format.toUpperCase()}`,
      defaultPath: `taskflow-export.${format}`,
      filters: [
        { name: format.toUpperCase(), extensions: [format] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!canceled && filePath) {
      writeFileSync(filePath, data, 'utf-8')
      return { success: true, filePath }
    }
    return { success: false }
  })

  // File import
  ipcMain.handle('file:import', async (_, format: 'json' | 'csv') => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: `Import ${format.toUpperCase()} file`,
      filters: [
        { name: format.toUpperCase(), extensions: [format] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    })

    if (!canceled && filePaths.length > 0) {
      const content = readFileSync(filePaths[0], 'utf-8')
      return { success: true, content }
    }
    return { success: false }
  })
}
