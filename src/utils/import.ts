import { Task } from '../../shared/types'

export function importFromJSON(jsonString: string): Task[] {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: expected array')
    }
    return data.map(validateTask)
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`)
  }
}

export function importFromCSV(csvString: string): Task[] {
  try {
    const lines = csvString.split('\n').filter((line) => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows')
    }

    const headers = parseCSVLine(lines[0])
    const tasks: Task[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const task: Record<string, unknown> = {}

      headers.forEach((header, index) => {
        let value: unknown = values[index] || ''

        if (header === 'tags') {
          value = typeof value === 'string'
            ? value.split(', ').filter(Boolean)
            : []
        } else if (header === 'order') {
          value = parseInt(value as string, 10) || 0
        }

        task[header] = value
      })

      tasks.push(validateTask(task))
    }

    return tasks
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error}`)
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
  }

  result.push(current.trim())
  return result
}

function validateTask(data: Record<string, unknown>): Task {
  if (!data.id || !data.title) {
    throw new Error('Task must have id and title')
  }

  return {
    id: String(data.id),
    title: String(data.title),
    description: data.description ? String(data.description) : undefined,
    status: isValidStatus(data.status) ? data.status : 'todo',
    priority: isValidPriority(data.priority) ? data.priority : 'medium',
    tags: Array.isArray(data.tags) ? data.tags : [],
    dueDate: data.dueDate ? String(data.dueDate) : undefined,
    createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
    completedAt: data.completedAt ? String(data.completedAt) : undefined,
    parentId: data.parentId ? String(data.parentId) : undefined,
    order: typeof data.order === 'number' ? data.order : 0
  }
}

function isValidStatus(status: unknown): status is Task['status'] {
  return status === 'todo' || status === 'in_progress' || status === 'done'
}

function isValidPriority(priority: unknown): priority is Task['priority'] {
  return priority === 'low' || priority === 'medium' || priority === 'high' || priority === 'urgent'
}
