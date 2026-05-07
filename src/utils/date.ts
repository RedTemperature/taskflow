import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'

type Locale = 'zh-CN' | 'en-US'

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export function formatDate(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'PPP', { locale: locales[locale] })
}

export function formatDateTime(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'PPp', { locale: locales[locale] })
}

export function formatRelativeDate(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (isToday(d)) {
    return locale === 'zh-CN' ? '今天' : 'Today'
  }
  if (isTomorrow(d)) {
    return locale === 'zh-CN' ? '明天' : 'Tomorrow'
  }
  if (isYesterday(d)) {
    return locale === 'zh-CN' ? '昨天' : 'Yesterday'
  }

  return formatDistanceToNow(d, { addSuffix: true, locale: locales[locale] })
}

export function isOverdue(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return isPast(d) && !isToday(d)
}

export function getDueDateStatus(
  date: Date | string | undefined
): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!date) return 'none'

  const d = typeof date === 'string' ? new Date(date) : date

  if (isOverdue(d)) return 'overdue'
  if (isToday(d)) return 'today'
  return 'upcoming'
}
