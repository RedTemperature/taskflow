import { useEffect, useState } from 'react'
import { useTaskStore } from './stores/taskStore'
import { useSettingsStore } from './stores/settingsStore'
import Layout from './components/layout/Layout'
import TaskList from './components/tasks/TaskList'
import KanbanBoard from './components/board/KanbanBoard'
import StatsPage from './components/stats/StatsPage'
import SettingsPage from './components/settings/SettingsPage'
import { useTheme } from './hooks/useTheme'
import { useShortcuts } from './hooks/useShortcuts'
import { ViewMode } from '../shared/types'

type Page = 'tasks' | 'stats' | 'settings'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('tasks')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { loadTasks } = useTaskStore()
  const { loadSettings, settings, setSettings } = useSettingsStore()

  useTheme()
  useShortcuts()

  useEffect(() => {
    loadTasks()
    loadSettings()
  }, [loadTasks, loadSettings])

  useEffect(() => {
    setViewMode(settings.defaultView)
  }, [settings.defaultView])

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':
        return viewMode === 'list' ? <TaskList /> : <KanbanBoard />
      case 'stats':
        return <StatsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <TaskList />
    }
  }

  return (
    <Layout
      currentPage={currentPage}
      viewMode={viewMode}
      onNavigate={setCurrentPage}
      onViewModeChange={(mode) => { setViewMode(mode); setSettings({ defaultView: mode }) }}
    >
      {renderPage()}
    </Layout>
  )
}
