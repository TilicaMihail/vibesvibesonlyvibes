type ProgressColor = 'brand' | 'indigo' | 'green' | 'yellow' | 'red'
type ProgressSize = 'sm' | 'md'

interface ProgressBarProps {
  value: number
  size?: ProgressSize
  showLabel?: boolean
  color?: ProgressColor
}

const colorClasses: Record<ProgressColor, string> = {
  brand: 'bg-brand',
  indigo: 'bg-brand',
  green: 'bg-[#2d6a4f]',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

const trackHeightClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

export default function ProgressBar({
  value,
  size = 'md',
  showLabel = false,
  color = 'brand',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="flex items-center gap-3">
      <div
        className={['flex-1 bg-surface-border rounded-full overflow-hidden', trackHeightClasses[size]].join(' ')}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={[
            'h-full rounded-full transition-all duration-300 ease-in-out',
            colorClasses[color],
          ].join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {showLabel && (
        <span className="shrink-0 text-sm font-medium text-on-surface-muted w-10 text-right">
          {clamped}%
        </span>
      )}
    </div>
  )
}
