'use client'

import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent focus:ring-indigo-500',
  secondary:
    'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500',
  ghost:
    'text-gray-600 hover:bg-gray-100 border border-transparent focus:ring-gray-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}

const spinnerSizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading && (
        <Spinner
          size={spinnerSizeMap[size]}
          className={variant === 'secondary' || variant === 'ghost' ? 'text-gray-500' : 'text-white'}
        />
      )}
      {children}
    </button>
  )
}
