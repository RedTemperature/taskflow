import { useState } from 'react'
import {
  Filter,
  SortAsc,
  SortDesc,
  CheckSquare,
  Clock,
  AlertCircle,
  ListTodo
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import { useSettingsStore } from '../../stores/settingsStore'
import TaskCard from './TaskCard'
import { Task } from '../../../shared/types'

type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title'
type SortDirection = 'asc' | 'desc'

export default function TaskList() {
  const { t } = useTranslation()
  const { getFilteredTasks, filters, setFilters, tasks } = useTaskStore()
  const { settings } = useSettingsStore()
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTasks = getFilteredTasks()

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0
        else if (!a.dueDate) comparison = 1
        else if (!b.dueDate) comparison = -1
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'priority':
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const displayTasks = settings.showCompletedTasks
    ? sortedTasks
    : sortedTasks.filter((t) => t.status !== 'done')

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const allTags = [...new Set(tasks.flatMap((t) => t.tags))]

  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter((t) => t.status === 'done').length,
    inProgress: filteredTasks.filter((t) => t.status === 'in_progress').length,
    overdue: filteredTasks.filter((t) => {
      if (!t.dueDate || t.status === 'done') return false
      return new Date(t.dueDate) < new Date()
    }).length
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.total')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.completed')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.inProgress')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.overdue')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters
                ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            {t('taskList.filters')}
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
            {[
              { field: 'createdAt' as SortField, label: t('taskList.sortDate') },
              { field: 'priority' as SortField, label: t('taskList.sortPriority') },
              { field: 'dueDate' as SortField, label: t('taskList.sortDueDate') }
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                  sortField === field
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {label}
                {sortField === field &&
                  (sortDirection === 'asc' ? (
                    <SortAsc className="ml-1 inline h-3 w-3" />
                  ) : (
                    <SortDesc className="ml-1 inline h-3 w-3" />
                  ))}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={settings.showCompletedTasks}
            onChange={(e) =>
              useSettingsStore.getState().setSettings({ showCompletedTasks: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          {t('taskList.showCompleted')}
        </label>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('taskList.filterStatus')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value as Task['status'] | 'all' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="todo">{t('status.todo')}</option>
                <option value="in_progress">{t('status.in_progress')}</option>
                <option value="done">{t('status.done')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('taskList.filterPriority')}
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ priority: e.target.value as Task['priority'] | 'all' })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="low">{t('priority.low')}</option>
                <option value="medium">{t('priority.medium')}</option>
                <option value="high">{t('priority.high')}</option>
                <option value="urgent">{t('priority.urgent')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('taskList.filterDueDate')}
              </label>
              <select
                value={filters.dueDateRange}
                onChange={(e) =>
                  setFilters({ dueDateRange: e.target.value as typeof filters.dueDateRange })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="today">{t('filter.today')}</option>
                <option value="week">{t('filter.week')}</option>
                <option value="overdue">{t('filter.overdue')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('taskList.filterTags')}
              </label>
              <select
                value={filters.tags[0] || ''}
                onChange={(e) => setFilters({ tags: e.target.value ? [e.target.value] : [] })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('filter.all')}</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {displayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 dark:border-gray-600">
            <ListTodo className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {t('taskList.empty')}
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {t('taskList.emptyHint')}
            </p>
          </div>
        ) : (
          displayTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
