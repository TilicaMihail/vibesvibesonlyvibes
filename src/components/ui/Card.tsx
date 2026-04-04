import { ReactNode } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: CardPadding
  hover?: boolean
  onClick?: () => void
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-surface-raised rounded-xl border border-surface-border shadow-sm',
        hover
          ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer'
          : '',
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
