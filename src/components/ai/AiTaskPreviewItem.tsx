import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AISuggestedTask } from '../../../shared/types'

interface Props {
  task: AISuggestedTask
  onUpdate: (tempId: string, updates: Partial<AISuggestedTask>) => void
  onRemove: (tempId: string) => void
}

const priorityColors: Record<string, string> = {
  low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  high: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  urgent: 'text-red-500 bg-red-50 dark:bg-red-900/20'
}

export default function AiTaskPreviewItem({ task, onUpdate, onRemove }: Props) {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !task.tags.includes(tag)) {
      onUpdate(task.tempId, { tags: [...task.tags, tag] })
      setTagInput('')
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <input
            type="text"
            value={task.title}
            onChange={(e) => onUpdate(task.tempId, { title: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            value={task.description || ''}
            onChange={(e) => onUpdate(task.tempId, { description: e.target.value || undefined })}
            placeholder={t('aiGenerator.editDescription')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={task.priority}
              onChange={(e) => onUpdate(task.tempId, { priority: e.target.value as AISuggestedTask['priority'] })}
              className={`rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium focus:border-primary-500 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-white ${priorityColors[task.priority]}`}
            >
              <option value="low">{t('priority.low')}</option>
              <option value="medium">{t('priority.medium')}</option>
              <option value="high">{t('priority.high')}</option>
              <option value="urgent">{t('priority.urgent')}</option>
            </select>

            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => onUpdate(task.tempId, { dueDate: e.target.value || undefined })}
              className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs focus:border-primary-500 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder={t('aiGenerator.addTag')}
                className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-primary-500 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onUpdate(task.tempId, { tags: task.tags.filter((t) => t !== tag) })}
                    className="rounded-full p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onRemove(task.tempId)}
          className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          title={t('aiGenerator.removeTask')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
