'use client'

import { ReactNode, useEffect, useCallback } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: ModalSize
}

const maxWidthClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={[
          'bg-surface-raised rounded-xl shadow-xl w-full max-h-[90vh] overflow-y-auto',
          maxWidthClasses[size],
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          {title ? (
            <h2 id="modal-title" className="text-lg font-semibold text-on-surface">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="cursor-pointer ml-auto flex h-8 w-8 items-center justify-center rounded-full text-on-surface-faint hover:bg-surface-border hover:text-on-surface-muted transition-colors"
            aria-label="Close modal"
          >
            <span aria-hidden="true" className="text-xl leading-none select-none">
              &times;
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
