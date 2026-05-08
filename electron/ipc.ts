import { ipcMain, BrowserWindow, dialog } from 'electron'
import { getTasks, saveTasks, getSettings, saveSettings } from './store'
import { readFileSync, writeFileSync } from 'fs'
import OpenAI from 'openai'
import { AISuggestedTask } from '../shared/types'

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

  // AI Task Generation
  ipcMain.handle('ai:generateTasks', async (_, text: string) => {
    const settings = getSettings()

    if (!settings.aiApiKey) {
      return { success: false, error: 'API key not configured. Please add your API key in Settings.' }
    }
    if (!text || !text.trim()) {
      return { success: false, error: 'No text provided.' }
    }

    try {
      const client = new OpenAI({
        apiKey: settings.aiApiKey,
        baseURL: settings.aiBaseUrl || 'https://api.deepseek.com'
      })

      const systemPrompt = `You are a task extraction assistant. Analyze the provided text and extract actionable tasks.

Rules:
1. Identify each distinct task or action item.
2. Infer a priority (low, medium, high, urgent) from urgency cues.
3. Infer relevant tags from categories mentioned (e.g., "meeting" → ["meeting"], "bug" → ["bug", "dev"]).
4. Infer due dates when mentioned (return as YYYY-MM-DD format).
5. Return ONLY a JSON object with a "tasks" key containing an array. Example: {"tasks": [{"title": "...", "priority": "high", "tags": ["meeting"], "dueDate": "2026-05-15"}]}
6. Task schema: {"title": "string (required, under 80 chars)", "description": "string (optional)", "priority": "low|medium|high|urgent", "tags": ["string", ...], "dueDate": "YYYY-MM-DD (optional)"}
7. Return {"tasks": []} if no tasks found.`

      const response = await client.chat.completions.create({
        model: settings.aiModel || 'deepseek-v4-flash',
        max_tokens: 4096,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ]
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        return { success: false, error: 'Empty response from API.' }
      }

      let jsonStr = content.trim()
      const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlock) jsonStr = codeBlock[1].trim()

      const parsed = JSON.parse(jsonStr)
      const taskArray = Array.isArray(parsed) ? parsed : (parsed.tasks || [])
      if (!Array.isArray(taskArray)) {
        return { success: false, error: 'API returned unexpected format. Please try again.' }
      }

      const tasks: AISuggestedTask[] = taskArray.map((item: Record<string, unknown>, i: number) => ({
        tempId: `ai-${i}-${Date.now()}`,
        title: typeof item.title === 'string' ? item.title : `Task ${i + 1}`,
        description: typeof item.description === 'string' ? item.description : undefined,
        priority: ['low', 'medium', 'high', 'urgent'].includes(item.priority as string)
          ? (item.priority as AISuggestedTask['priority'])
          : 'medium',
        tags: Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === 'string') : [],
        dueDate: typeof item.dueDate === 'string' && item.dueDate.length > 0 ? item.dueDate : undefined
      }))

      return { success: true, tasks }
    } catch (error: unknown) {
      console.error('AI generation failed:', error)
      if (error instanceof SyntaxError) {
        return { success: false, error: 'Failed to parse AI response. Please try again.' }
      }
      const apiError = error as { status?: number; message?: string }
      if (apiError.status === 401) {
        return { success: false, error: 'Invalid API key. Please check your API key in Settings.' }
      }
      if (apiError.status === 429) {
        return { success: false, error: 'Rate limited. Please wait and try again.' }
      }
      if (apiError.status) {
        return { success: false, error: `API error (${apiError.status}): ${apiError.message}` }
      }
      return { success: false, error: 'Network or connection error. Please check your API URL and network.' }
    }
  })
}
