import { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  danger:  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  info:    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400',
}

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
