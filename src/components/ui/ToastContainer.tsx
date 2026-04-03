'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeToast, Toast } from '@/store/slices/uiSlice'

// ─── Per-toast display ────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const toastConfig = {
  success: {
    borderColor: 'border-green-500',
    iconColor: 'text-green-500',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    borderColor: 'border-red-500',
    iconColor: 'text-red-500',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  info: {
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-500',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
        />
      </svg>
    ),
  },
} as const

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const cfg = toastConfig[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'flex items-start gap-3 bg-white shadow-lg rounded-lg p-4 border-l-4 w-80 max-w-full',
        'animate-[slideInRight_0.2s_ease-out]',
        cfg.borderColor,
      ].join(' ')}
    >
      {/* Type icon */}
      <span className={cfg.iconColor}>{cfg.icon}</span>

      {/* Message */}
      <p className="flex-1 text-sm text-gray-700 leading-snug">{toast.message}</p>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
        aria-label="Dismiss notification"
      >
        <span aria-hidden="true" className="text-lg leading-none select-none">
          &times;
        </span>
      </button>
    </div>
  )
}

// ─── Container ───────────────────────────────────────────────────────────────

export default function ToastContainer() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.ui.toasts)

  const handleRemove = (id: string) => dispatch(removeToast(id))

  if (toasts.length === 0) return null

  return (
    <>
      {/* Keyframe injection — Tailwind v4 doesn't need a config for arbitrary animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(1.5rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
        ))}
      </div>
    </>
  )
}
