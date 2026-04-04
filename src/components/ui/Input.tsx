import { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  const baseInputClasses =
    'block w-full rounded-lg border px-3 py-2 text-sm ' +
    'text-gray-900 dark:text-gray-100 ' +
    'bg-white dark:bg-gray-700 ' +
    'placeholder-gray-400 dark:placeholder-gray-500 ' +
    'focus:outline-none focus:ring-2 transition-colors duration-150 ' +
    'disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed'

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'

  const paddingLeft = leftIcon ? 'pl-9' : 'pl-3'
  const paddingRight = rightIcon ? 'pr-9' : 'pr-3'

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={[baseInputClasses, stateClasses, paddingLeft, paddingRight].join(' ')}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />

        {rightIcon && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}
