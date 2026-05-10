import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Task } from '../../../shared/types'
import TaskForm from './TaskForm'
import SubTaskList from './SubTaskList'

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  high: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  urgent: 'text-red-500 bg-red-50 dark:bg-red-900/20'
}

const priorityDots = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

export default function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation()
  const { settings } = useSettingsStore()
  const { toggleTaskStatus, deleteTask, getSubtasks, setSelectedTask, selectedTaskId } =
    useTaskStore()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)

  const subtasks = getSubtasks(task.id)
  const completedSubtasks = subtasks.filter((st) => st.status === 'done').length
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'done'
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))
  const isSelected = selectedTaskId === task.id
  const locale = settings.language === 'zh-CN' ? zhCN : enUS

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null
    const date = new Date(task.dueDate)
    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0
    const timeStr = hasTime
      ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      : ''

    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 text-red-500">
          <Clock className="h-3.5 w-3.5" />
          {timeStr ? `${t('taskCard.overdue')} ${timeStr}` : t('taskCard.overdue')}
        </span>
      )
    }

    if (isDueToday) {
      return (
        <span className="flex items-center gap-1 text-orange-500">
          <Clock className="h-3.5 w-3.5" />
          {timeStr ? `${t('taskCard.today')} ${timeStr}` : t('taskCard.today')}
        </span>
      )
    }

    return (
      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <Clock className="h-3.5 w-3.5" />
        {format(date, 'MM/dd', { locale })}{timeStr ? ` ${timeStr}` : ''}
      </span>
    )
  }

  return (
    <>
      <div
        onClick={() => setSelectedTask(isSelected ? null : task.id)}
        className={`group cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-md dark:bg-gray-800 ${
          isSelected
            ? 'border-primary-300 ring-2 ring-primary-200 dark:border-primary-600 dark:ring-primary-800'
            : 'border-gray-200 dark:border-gray-700'
        } ${task.status === 'done' ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleTaskStatus(task.id)
            }}
            className="mt-0.5 flex-shrink-0"
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-primary-500" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <h3
                className={`text-sm font-medium ${
                  task.status === 'done'
                    ? 'text-gray-400 line-through dark:text-gray-500'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>

              <div className="relative ml-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(!showMenu)
                  }}
                  className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowEditForm(true)
                        setShowMenu(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                      {t('taskCard.edit')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddSubtask(true)
                        setShowMenu(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                      {t('taskCard.addSubtask')}
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task.id)
                        setShowMenu(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('taskCard.delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {task.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${priorityDots[task.priority]}`} />
                {t(`priority.${task.priority}`)}
              </span>

              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}

              {getDueDateDisplay()}

              {subtasks.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSubtasks(!showSubtasks)
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showSubtasks ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  {completedSubtasks}/{subtasks.length}
                </button>
              )}
            </div>
          </div>
        </div>

        {showSubtasks && subtasks.length > 0 && (
          <div className="ml-8 mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
            <SubTaskList tasks={subtasks} />
          </div>
        )}
      </div>

      {showEditForm && (
        <TaskForm task={task} onClose={() => setShowEditForm(false)} />
      )}

      {showAddSubtask && (
        <TaskForm parentId={task.id} onClose={() => setShowAddSubtask(false)} />
      )}
    </>
  )
}
