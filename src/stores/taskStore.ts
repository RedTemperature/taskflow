import { create } from 'zustand'
import { Task, TaskFilters, TaskStats } from '../../shared/types'
import { nanoid } from 'nanoid'

interface TaskState {
  tasks: Task[]
  filters: TaskFilters
  isLoading: boolean
  selectedTaskId: string | null

  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  setSelectedTask: (id: string | null) => void
  getFilteredTasks: () => Task[]
  getSubtasks: (parentId: string) => Task[]
  getStats: () => TaskStats
  loadTasks: () => Promise<void>
  saveTasks: () => Promise<void>
}

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  tags: [],
  dueDateRange: 'all'
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filters: defaultFilters,
  isLoading: false,
  selectedTaskId: null,

  setTasks: (tasks) => set({ tasks }),

  addTask: (taskData) => {
    const state = get()
    const maxOrder = state.tasks.reduce((max, t) => Math.max(max, t.order), 0)
    const newTask: Task = {
      ...taskData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: maxOrder + 1
    }
    set({ tasks: [...state.tasks, newTask] })
    get().saveTasks()
  },

  updateTask: (id, updates) => {
    const state = get()
    const tasks = state.tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    )
    set({ tasks })
    get().saveTasks()
  },

  deleteTask: (id) => {
    const state = get()
    const tasks = state.tasks.filter((task) => task.id !== id && task.parentId !== id)
    set({ tasks, selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId })
    get().saveTasks()
  },

  toggleTaskStatus: (id) => {
    const state = get()
    const task = state.tasks.find((t) => t.id === id)
    if (!task) return

    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const updates: Partial<Task> = {
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined
    }
    get().updateTask(id, updates)
  },

  reorderTasks: (tasks) => {
    set({ tasks })
    get().saveTasks()
  },

  setFilters: (filters) => {
    const state = get()
    set({ filters: { ...state.filters, ...filters } })
  },

  setSelectedTask: (id) => set({ selectedTaskId: id }),

  getFilteredTasks: () => {
    const { tasks, filters } = get()
    const rootTasks = tasks.filter((t) => !t.parentId)

    return rootTasks.filter((task) => {
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(search)
        const matchesDesc = task.description?.toLowerCase().includes(search)
        const matchesTags = task.tags.some((t) => t.toLowerCase().includes(search))
        if (!matchesTitle && !matchesDesc && !matchesTags) return false
      }

      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false

      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => task.tags.includes(tag))
        if (!hasTag) return false
      }

      if (filters.dueDateRange !== 'all' && task.dueDate) {
        const dueDate = new Date(task.dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        switch (filters.dueDateRange) {
          case 'today': {
            const todayEnd = new Date(today)
            todayEnd.setDate(todayEnd.getDate() + 1)
            if (dueDate < today || dueDate >= todayEnd) return false
            break
          }
          case 'week': {
            const weekEnd = new Date(today)
            weekEnd.setDate(weekEnd.getDate() + 7)
            if (dueDate < today || dueDate >= weekEnd) return false
            break
          }
          case 'overdue': {
            if (dueDate >= today || task.status === 'done') return false
            break
          }
        }
      }

      return true
    })
  },

  getSubtasks: (parentId) => {
    const { tasks } = get()
    return tasks.filter((t) => t.parentId === parentId)
  },

  getStats: () => {
    const { tasks } = get()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats: TaskStats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'done').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      overdue: tasks.filter((t) => {
        if (!t.dueDate || t.status === 'done') return false
        return new Date(t.dueDate) < today
      }).length,
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
      byStatus: { todo: 0, in_progress: 0, done: 0 },
      completedByDay: []
    }

    tasks.forEach((task) => {
      stats.byPriority[task.priority]++
      stats.byStatus[task.status]++
    })

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    stats.completedByDay = last7Days.map((date) => ({
      date,
      count: tasks.filter(
        (t) => t.status === 'done' && t.completedAt?.startsWith(date)
      ).length
    }))

    return stats
  },

  loadTasks: async () => {
    set({ isLoading: true })
    try {
      const tasks = await window.api.getTasks()
      set({ tasks: (tasks as Task[]) || [], isLoading: false })
    } catch (error) {
      console.error('Failed to load tasks:', error)
      set({ isLoading: false })
    }
  },

  saveTasks: async () => {
    const { tasks } = get()
    try {
      await window.api.saveTasks(tasks)
    } catch (error) {
      console.error('Failed to save tasks:', error)
    }
  }
}))
