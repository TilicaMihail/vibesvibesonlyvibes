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
    <div className="border-b border-gray-200 dark:border-gray-700">
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
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-medium'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 font-normal',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium min-w-[1.25rem]',
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
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
