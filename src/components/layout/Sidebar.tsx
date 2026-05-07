import {
  CheckSquare,
  BarChart3,
  Settings,
  ListTodo
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: 'tasks' | 'stats' | 'settings') => void
}

const navItems = [
  { id: 'tasks' as const, icon: ListTodo, labelKey: 'sidebar.tasks' },
  { id: 'stats' as const, icon: BarChart3, labelKey: 'sidebar.stats' },
  { id: 'settings' as const, icon: Settings, labelKey: 'sidebar.settings' }
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">TaskFlow</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('sidebar.subtitle')}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {t(item.labelKey)}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          TaskFlow v1.0.0
        </p>
      </div>
    </aside>
  )
}
