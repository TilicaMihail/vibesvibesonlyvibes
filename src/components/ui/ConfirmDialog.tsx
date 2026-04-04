'use client'

import Modal from './Modal'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={confirmVariant} size="md" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
