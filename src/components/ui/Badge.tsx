import { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#d4edda] text-[#2d6a4f]',
  warning: 'bg-[#fff3cd] text-[#856404]',
  danger:  'bg-[#f8d7da] text-[#842029]',
  info:    'bg-surface-border text-on-surface-muted',
  neutral: 'bg-surface-border text-on-surface-faint border border-surface-border',
  primary: 'bg-brand/15 text-brand-dark',
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
