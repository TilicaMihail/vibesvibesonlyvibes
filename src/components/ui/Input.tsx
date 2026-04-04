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
    'text-on-surface ' +
    'bg-surface-raised ' +
    'placeholder-brand-light ' +
    'focus:outline-none focus:ring-2 transition-colors duration-150 ' +
    'disabled:bg-surface disabled:text-brand-light disabled:cursor-not-allowed'

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-surface-border focus:border-brand focus:ring-brand/30'

  const paddingLeft = leftIcon ? 'pl-9' : 'pl-3'
  const paddingRight = rightIcon ? 'pr-9' : 'pr-3'

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-on-surface-muted"
          
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-brand-light" >
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
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-brand-light" >
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-on-surface-muted">
          {helperText}
        </p>
      )}
    </div>
  )
}
