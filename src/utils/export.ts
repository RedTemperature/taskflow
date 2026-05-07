import { Task } from '../../shared/types'

export function exportToJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2)
}

export function exportToCSV(tasks: Task[]): string {
  const headers = [
    'id',
    'title',
    'description',
    'status',
    'priority',
    'tags',
    'dueDate',
    'createdAt',
    'updatedAt',
    'completedAt',
    'parentId',
    'order'
  ]

  const rows = tasks.map((task) =>
    headers
      .map((header) => {
        const value = task[header as keyof Task]
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`
        }
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      })
      .join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}
