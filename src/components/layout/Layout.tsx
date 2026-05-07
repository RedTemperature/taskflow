import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { ViewMode } from '../../../shared/types'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  viewMode: ViewMode
  onNavigate: (page: 'tasks' | 'stats' | 'settings') => void
  onViewModeChange: (mode: ViewMode) => void
}

export default function Layout({
  children,
  currentPage,
  viewMode,
  onNavigate,
  onViewModeChange
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          currentPage={currentPage}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">{children}</main>
      </div>
    </div>
  )
}
