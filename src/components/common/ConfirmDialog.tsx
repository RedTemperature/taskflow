import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500'
  }

  const iconStyles = {
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-primary-500'
  }

  return (
    <Modal onClose={onCancel} showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-700 ${iconStyles[variant]}`}>
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{message}</p>

        <div className="flex w-full gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
