import { useEffect } from 'react'
import { useTaskStore } from '../stores/taskStore'

export function useShortcuts() {
  const { selectedTaskId, toggleTaskStatus, deleteTask } = useTaskStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Ctrl/Cmd + N: New task (handled by Header component)
      // Ctrl/Cmd + F: Focus search (handled by Header component)

      // Task-specific shortcuts (only when a task is selected)
      if (selectedTaskId) {
        switch (e.key) {
          case ' ':
            e.preventDefault()
            toggleTaskStatus(selectedTaskId)
            break
          case 'Delete':
          case 'Backspace':
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault()
              deleteTask(selectedTaskId)
            }
            break
          case 'Escape':
            useTaskStore.getState().setSelectedTask(null)
            break
        }
      }

      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            // Navigate to tasks - handled by App component
            break
          case '2':
            e.preventDefault()
            // Navigate to stats
            break
          case '3':
            e.preventDefault()
            // Navigate to settings
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTaskId, toggleTaskStatus, deleteTask])
}
