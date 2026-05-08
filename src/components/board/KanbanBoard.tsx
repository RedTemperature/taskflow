import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import KanbanColumn from './KanbanColumn'
import TaskCard from '../tasks/TaskCard'
import { Task } from '../../../shared/types'

function SortableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
    >
      <TaskCard task={task} />
    </div>
  )
}

const columns: { id: Task['status']; titleKey: string }[] = [
  { id: 'todo', titleKey: 'status.todo' },
  { id: 'in_progress', titleKey: 'status.in_progress' },
  { id: 'done', titleKey: 'status.done' }
]

export default function KanbanBoard() {
  const { t } = useTranslation()
  const { tasks, updateTask, reorderTasks } = useTaskStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const getColumnTasks = (status: Task['status']) => {
    return tasks
      .filter((t) => t.status === status && !t.parentId)
      .sort((a, b) => a.order - b.order)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const overTask = tasks.find((t) => t.id === overId)
    const overColumn = columns.find((c) => c.id === overId)

    if (overTask && activeTask.status !== overTask.status) {
      updateTask(activeId, { status: overTask.status })
    } else if (overColumn && activeTask.status !== overColumn.id) {
      updateTask(activeId, { status: overColumn.id })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask) return

    if (overTask) {
      const sameColumnTasks = tasks
        .filter((t) => t.status === overTask.status && !t.parentId)
        .sort((a, b) => a.order - b.order)

      const activeIndex = sameColumnTasks.findIndex((t) => t.id === activeId)
      const overIndex = sameColumnTasks.findIndex((t) => t.id === overId)

      if (activeIndex !== -1) {
        sameColumnTasks.splice(activeIndex, 1)
      }
      sameColumnTasks.splice(overIndex, 0, activeTask)

      const updatedTasks = tasks.map((t) => {
        const reorderedTask = sameColumnTasks.find((st) => st.id === t.id)
        if (reorderedTask) {
          return { ...t, order: sameColumnTasks.indexOf(reorderedTask) }
        }
        return t
      })

      reorderTasks(updatedTasks)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id)

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={t(column.titleKey)}
              count={columnTasks.length}
            >
              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {t('kanban.emptyColumn')}
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
