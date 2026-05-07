import { X, Calendar, Tag, Flag, Clock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Task } from '../../../shared/types'
import SubTaskList from './SubTaskList'
import TaskForm from './TaskForm'
import { useState } from 'react'

interface TaskDetailProps {
  task: Task
  onClose: () => void
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

const statusLabels = {
  todo: 'status.todo',
  in_progress: 'status.in_progress',
  done: 'status.done'
}

export default function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { t } = useTranslation()
  const { settings } = useSettingsStore()
  const { getSubtasks, toggleTaskStatus } = useTaskStore()
  const [showEditForm, setShowEditForm] = useState(false)

  const subtasks = getSubtasks(task.id)
  const locale = settings.language === 'zh-CN' ? zhCN : enUS

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
        <div className="w-full max-w-md overflow-y-auto bg-white shadow-xl dark:bg-gray-800">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('taskDetail.title')}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300 hover:border-primary-500" />
                  )}
                </button>
                <div>
                  <h3
                    className={`text-xl font-semibold ${
                      task.status === 'done'
                        ? 'text-gray-400 line-through dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {t(statusLabels[task.status])}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('taskDetail.description')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
              </div>
            )}

            {/* Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('taskDetail.priority')}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${priorityColors[task.priority]}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t(`priority.${task.priority}`)}
                    </span>
                  </div>
                </div>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('taskDetail.dueDate')}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(task.dueDate), 'PPP', { locale })}
                    </p>
                  </div>
                </div>
              )}

              {task.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('taskDetail.tags')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                {t('taskDetail.createdAt')}{' '}
                {format(new Date(task.createdAt), 'PPp', { locale })}
              </div>
              {task.completedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('taskDetail.completedAt')}{' '}
                  {format(new Date(task.completedAt), 'PPp', { locale })}
                </div>
              )}
            </div>

            {/* Subtasks */}
            {subtasks.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('taskDetail.subtasks')} ({subtasks.filter((st) => st.status === 'done').length}/
                  {subtasks.length})
                </h4>
                <SubTaskList tasks={subtasks} />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                onClick={() => setShowEditForm(true)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('taskDetail.edit')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t('taskDetail.close')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditForm && <TaskForm task={task} onClose={() => setShowEditForm(false)} />}
    </>
  )
}
