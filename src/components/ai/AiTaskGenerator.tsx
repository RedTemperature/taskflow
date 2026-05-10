import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { useTaskStore } from '../../stores/taskStore'
import { AISuggestedTask, AIGenerateResult } from '../../../shared/types'
import AiTaskPreviewItem from './AiTaskPreviewItem'

interface Props {
  onClose: () => void
}

type Stage = 'input' | 'loading' | 'preview' | 'error'

export default function AiTaskGenerator({ onClose }: Props) {
  const { t } = useTranslation()
  const { addTask } = useTaskStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('input')
  const [inputText, setInputText] = useState('')
  const [suggestedTasks, setSuggestedTasks] = useState<AISuggestedTask[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      setInputText(text)
    } catch {
      // ignore unreadable files
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    setStage('loading')
    setErrorMessage('')

    try {
      const result: AIGenerateResult = await window.api.generateTasks(inputText.trim())
      if (result.success && result.tasks) {
        if (result.tasks.length === 0) {
          setErrorMessage(t('aiGenerator.noTasksFound'))
          setStage('error')
        } else {
          setSuggestedTasks(result.tasks)
          setStage('preview')
        }
      } else {
        setErrorMessage(result.error || t('aiGenerator.unknownError'))
        setStage('error')
      }
    } catch {
      setErrorMessage(t('aiGenerator.unknownError'))
      setStage('error')
    }
  }

  const handleTaskUpdate = (tempId: string, updates: Partial<AISuggestedTask>) => {
    setSuggestedTasks((prev) =>
      prev.map((task) => (task.tempId === tempId ? { ...task, ...updates } : task))
    )
  }

  const handleTaskRemove = (tempId: string) => {
    setSuggestedTasks((prev) => prev.filter((task) => task.tempId !== tempId))
  }

  const handleConfirmAll = () => {
    suggestedTasks.forEach((task) => {
      addTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
        status: 'todo',
        parentId: undefined
      })
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-xl bg-white shadow-xl dark:bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Sparkles className="h-5 w-5 text-primary-500" />
            {t('aiGenerator.title')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Input Stage */}
          {stage === 'input' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('aiGenerator.description')}
              </p>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('aiGenerator.inputPlaceholder')}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                autoFocus
              />

              <div className="flex items-center justify-between">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4" />
                    {t('aiGenerator.uploadFile')}
                  </button>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {t('aiGenerator.uploadHint')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Stage */}
          {stage === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary-500" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {t('aiGenerator.generating')}
              </p>
            </div>
          )}

          {/* Error Stage */}
          {stage === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Preview Stage */}
          {stage === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('aiGenerator.tasksFound', { count: suggestedTasks.length })}
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {suggestedTasks.map((task) => (
                  <AiTaskPreviewItem
                    key={task.tempId}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onRemove={handleTaskRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          {stage === 'input' && (
            <>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('aiGenerator.cancel')}
              </button>
              <button
                onClick={handleGenerate}
                disabled={!inputText.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {t('aiGenerator.generate')}
              </button>
            </>
          )}

          {stage === 'loading' && (
            <button
              onClick={onClose}
              disabled
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 dark:border-gray-600 dark:text-gray-500"
            >
              {t('aiGenerator.cancel')}
            </button>
          )}

          {(stage === 'error') && (
            <>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('aiGenerator.cancel')}
              </button>
              <button
                onClick={() => { setStage('input'); setErrorMessage('') }}
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                {t('aiGenerator.tryAgain')}
              </button>
            </>
          )}

          {stage === 'preview' && (
            <>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('aiGenerator.cancel')}
              </button>
              <button
                onClick={handleConfirmAll}
                disabled={suggestedTasks.length === 0}
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('aiGenerator.confirmAll', { count: suggestedTasks.length })}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
