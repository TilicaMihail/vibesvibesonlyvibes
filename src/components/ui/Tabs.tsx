'use client'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-surface-border">
      <nav className="-mb-px flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={[
                'cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150 border-b-2 focus:outline-none',
                isActive
                  ? 'border-brand text-brand font-medium'
                  : 'border-transparent text-on-surface-muted hover:text-on-surface hover:border-brand-light font-normal',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium min-w-[1.25rem]',
                    isActive
                      ? 'bg-brand/15 text-brand-dark'
                      : 'bg-surface-border text-on-surface-muted',
                  ].join(' ')}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
