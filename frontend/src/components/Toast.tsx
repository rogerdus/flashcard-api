import { useEffect } from 'react'
import type { ToastData } from '../types'

interface ToastProps {
  toast: ToastData
  onDismiss: () => void
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className={`toast toast-${toast.type}`} onClick={onDismiss} role="alert">
      <span className="toast-icon">
        {toast.type === 'success' ? '✓' : '✕'}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  )
}
