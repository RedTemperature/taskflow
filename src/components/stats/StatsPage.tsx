import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../stores/taskStore'
import Charts from './Charts'
import {
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  ListTodo
} from 'lucide-react'

export default function StatsPage() {
  const { t } = useTranslation()
  const { getStats } = useTaskStore()
  const stats = getStats()

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('stats.title')}
      </h2>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('stats.total')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('stats.completed')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.inProgress}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('stats.inProgress')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('stats.overdue')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('stats.completionRate')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <Charts stats={stats} />
    </div>
  )
}
