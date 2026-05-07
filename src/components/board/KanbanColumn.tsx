import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Task } from '../../../shared/types'

interface KanbanColumnProps {
  id: Task['status']
  title: string
  count: number
  children: ReactNode
}

const statusColors = {
  todo: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500'
}

export default function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex w-80 flex-shrink-0 flex-col rounded-xl border bg-gray-50/50 transition-colors dark:bg-gray-900/50 ${
        isOver
          ? 'border-primary-300 bg-primary-50/50 dark:border-primary-600 dark:bg-primary-900/10'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className={`h-3 w-3 rounded-full ${statusColors[id]}`} />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {count}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">{children}</div>
    </div>
  )
}
