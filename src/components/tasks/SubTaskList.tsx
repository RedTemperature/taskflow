import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { useTaskStore } from '../../stores/taskStore'
import { Task } from '../../../shared/types'

interface SubTaskListProps {
  tasks: Task[]
}

export default function SubTaskList({ tasks }: SubTaskListProps) {
  const { toggleTaskStatus, deleteTask } = useTaskStore()

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="flex-shrink-0"
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-gray-400 hover:text-primary-500" />
            )}
          </button>

          <span
            className={`flex-1 text-sm ${
              task.status === 'done'
                ? 'text-gray-400 line-through dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            className="flex-shrink-0 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
