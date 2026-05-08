export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  parentId?: string
  order: number
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  defaultView: 'list' | 'board'
  showCompletedTasks: boolean
  aiModel?: string
  aiBaseUrl?: string
  aiApiKey?: string
}

export interface TaskFilters {
  search: string
  status: Task['status'] | 'all'
  priority: Task['priority'] | 'all'
  tags: string[]
  dueDateRange: 'all' | 'today' | 'week' | 'overdue'
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  overdue: number
  byPriority: Record<Task['priority'], number>
  byStatus: Record<Task['status'], number>
  completedByDay: { date: string; count: number }[]
}

export type ViewMode = 'list' | 'board'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ExportResult {
  success: boolean
  filePath?: string
}

export interface ImportResult {
  success: boolean
  content?: string
}

export interface AISuggestedTask {
  tempId: string
  title: string
  description?: string
  priority: Task['priority']
  tags: string[]
  dueDate?: string
}

export interface AIGenerateResult {
  success: boolean
  tasks?: AISuggestedTask[]
  error?: string
}
