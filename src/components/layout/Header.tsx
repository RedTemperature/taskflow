import { Plus, Search, LayoutGrid, List, Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import { useSettingsStore } from '../../stores/settingsStore'
import TaskForm from '../tasks/TaskForm'
import { ViewMode } from '../../../shared/types'

interface HeaderProps {
  currentPage: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export default function Header({ currentPage, viewMode, onViewModeChange }: HeaderProps) {
  const { t } = useTranslation()
  const { filters, setFilters } = useTaskStore()
  const { settings, setSettings } = useSettingsStore()
  const [showTaskForm, setShowTaskForm] = useState(false)

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }
  const ThemeIcon = themeIcons[settings.theme]

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(settings.theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setSettings({ theme: nextTheme })
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          {currentPage === 'tasks' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-64 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-600">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`rounded-md p-1.5 ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title={t('header.listView')}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('board')}
                  className={`rounded-md p-1.5 ${
                    viewMode === 'board'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title={t('header.boardView')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={t(`header.theme.${settings.theme}`)}
          >
            <ThemeIcon className="h-5 w-5" />
          </button>

          {currentPage === 'tasks' && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              {t('header.addTask')}
            </button>
          )}
        </div>
      </header>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
    </>
  )
}
