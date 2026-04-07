'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  danger?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export default function Dropdown({ trigger, items, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  const alignClass = align === 'right' ? 'right-0' : 'left-0'

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={[
            'absolute mt-1 z-50 bg-surface-raised border border-surface-border rounded-lg shadow-lg py-1 min-w-[160px]',
            alignClass,
          ].join(' ')}
          role="menu"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              role="menuitem"
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className={[
                'flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-left transition-colors duration-100',
                item.danger
                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-on-surface hover:bg-surface-border',
              ].join(' ')}
            >
              {item.icon && (
                <span className="shrink-0 text-base leading-none">{item.icon}</span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
