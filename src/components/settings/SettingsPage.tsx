import { useState } from 'react'
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  LayoutGrid,
  List,
  Upload,
  FileJson,
  FileSpreadsheet,
  Sparkles,
  Eye,
  EyeOff,
  Check
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../stores/settingsStore'
import { useTaskStore } from '../../stores/taskStore'
import { exportToJSON, exportToCSV } from '../../utils/export'
import { importFromJSON, importFromCSV } from '../../utils/import'
import { Settings } from '../../../shared/types'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { settings, setSettings } = useSettingsStore()
  const { tasks, setTasks } = useTaskStore()
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showApiKey, setShowApiKey] = useState(false)
  const [localAIModel, setLocalAIModel] = useState(settings.aiModel || '')
  const [localAIBaseUrl, setLocalAIBaseUrl] = useState(settings.aiBaseUrl || '')
  const [localAIApiKey, setLocalAIApiKey] = useState(settings.aiApiKey || '')
  const [aiSaved, setAiSaved] = useState(false)

  const presets: { label: string; model: string; url: string }[] = [
    { label: t('settings.ai.presetDeepSeek'), model: 'deepseek-v4-flash', url: 'https://api.deepseek.com' },
    { label: t('settings.ai.presetChatGPT'), model: 'gpt-4o-mini', url: 'https://api.openai.com' },
    { label: t('settings.ai.presetCustom'), model: '', url: '' }
  ]

  const themeOptions: { value: Settings['theme']; icon: typeof Sun; labelKey: string }[] = [
    { value: 'light', icon: Sun, labelKey: 'settings.theme.light' },
    { value: 'dark', icon: Moon, labelKey: 'settings.theme.dark' },
    { value: 'system', icon: Monitor, labelKey: 'settings.theme.system' }
  ]

  const viewOptions: { value: Settings['defaultView']; icon: typeof List; labelKey: string }[] = [
    { value: 'list', icon: List, labelKey: 'settings.view.list' },
    { value: 'board', icon: LayoutGrid, labelKey: 'settings.view.board' }
  ]

  const handleThemeChange = (theme: Settings['theme']) => {
    setSettings({ theme })
  }

  const handleLanguageChange = (language: Settings['language']) => {
    setSettings({ language })
    i18n.changeLanguage(language)
  }

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = format === 'json' ? exportToJSON(tasks) : exportToCSV(tasks)
      const result = await window.api.exportData(data, format)
      setExportStatus(result.success ? 'success' : 'error')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const handleImport = async (format: 'json' | 'csv') => {
    try {
      const result = await window.api.importData(format)
      if (!result.success || !result.content) {
        setImportStatus('error')
        setTimeout(() => setImportStatus('idle'), 3000)
        return
      }

      const importedTasks = format === 'json'
        ? importFromJSON(result.content)
        : importFromCSV(result.content)

      const existingIds = new Set(tasks.map((t) => t.id))
      const newTasks = importedTasks.filter((t) => !existingIds.has(t.id))

      if (newTasks.length > 0) {
        setTasks([...tasks, ...newTasks])
      }

      setImportStatus('success')
      setTimeout(() => setImportStatus('idle'), 3000)
    } catch (error) {
      console.error('Import failed:', error)
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 3000)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('settings.title')}
      </h2>

      <div className="space-y-6">
        {/* Theme */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.appearance')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, icon: Icon, labelKey }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  settings.theme === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    settings.theme === value
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    settings.theme === value
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(labelKey)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Globe className="h-5 w-5" />
            {t('settings.language')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'zh-CN' as const, label: '简体中文' },
              { value: 'en-US' as const, label: 'English' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleLanguageChange(value)}
                className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                  settings.language === value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Default View */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.defaultView')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {viewOptions.map(({ value, icon: Icon, labelKey }) => (
              <button
                key={value}
                onClick={() => setSettings({ defaultView: value })}
                className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                  settings.defaultView === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    settings.defaultView === value
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    settings.defaultView === value
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(labelKey)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Configuration */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Sparkles className="h-5 w-5" />
            {t('settings.ai.title')}
          </h3>

          <div className="space-y-4">
            {/* Presets */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.ai.presetLabel')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(({ label, model, url }) => (
                  <button
                    key={label}
                    onClick={() => { setLocalAIModel(model); setLocalAIBaseUrl(url) }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.ai.modelLabel')}
              </label>
              <input
                type="text"
                value={localAIModel}
                onChange={(e) => setLocalAIModel(e.target.value)}
                placeholder={t('settings.ai.modelPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Base URL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.ai.baseUrlLabel')}
              </label>
              <input
                type="text"
                value={localAIBaseUrl}
                onChange={(e) => setLocalAIBaseUrl(e.target.value)}
                placeholder={t('settings.ai.baseUrlPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.ai.apiKeyLabel')}
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={localAIApiKey}
                  onChange={(e) => setLocalAIApiKey(e.target.value)}
                  placeholder={t('settings.ai.apiKeyPlaceholder')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                {t('settings.ai.apiKeyHint')}
              </p>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between">
              {aiSaved && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  {t('settings.ai.saved')}
                </span>
              )}
              <button
                onClick={() => {
                  setSettings({ aiModel: localAIModel.trim() || undefined, aiBaseUrl: localAIBaseUrl.trim() || undefined, aiApiKey: localAIApiKey.trim() || undefined })
                  setAiSaved(true)
                  setTimeout(() => setAiSaved(false), 3000)
                }}
                disabled={!localAIApiKey.trim() && !localAIModel.trim()}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('settings.ai.saveKey')}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.dataManagement')}
          </h3>

          <div className="space-y-4">
            {/* Export */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.export')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FileJson className="h-4 w-4" />
                  JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </button>
              </div>
              {exportStatus === 'success' && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {t('settings.exportSuccess')}
                </p>
              )}
              {exportStatus === 'error' && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {t('settings.exportError')}
                </p>
              )}
            </div>

            {/* Import */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.import')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleImport('json')}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  JSON
                </button>
                <button
                  onClick={() => handleImport('csv')}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  CSV
                </button>
              </div>
              {importStatus === 'success' && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {t('settings.importSuccess')}
                </p>
              )}
              {importStatus === 'error' && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {t('settings.importError')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
