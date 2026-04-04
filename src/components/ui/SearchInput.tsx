'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(localValue)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={['relative flex items-center', className].filter(Boolean).join(' ')}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </span>

      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={[
          'block w-full rounded-lg border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-700',
          'py-2 pl-9 text-sm text-gray-900 dark:text-gray-100',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500',
          'transition-colors duration-150',
          localValue ? 'pr-8' : 'pr-3',
        ].join(' ')}
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <span aria-hidden="true" className="text-lg leading-none select-none">
            &times;
          </span>
        </button>
      )}
    </div>
  )
}
