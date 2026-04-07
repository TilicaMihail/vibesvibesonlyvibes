type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: AvatarSize
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
}

// 6 background + text colour pairs derived from hash
const colorPalette: string[] = [
  'bg-brand text-white',
  'bg-purple-500 text-white',
  'bg-green-600 text-white',
  'bg-blue-500 text-white',
  'bg-brand-dark text-white',
  'bg-pink-500 text-white',
]

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return hash
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps) {
  const colorClass = colorPalette[hashName(name) % colorPalette.length]
  const initials = getInitials(name)

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={[
          'rounded-full object-cover shrink-0',
          sizeClasses[size],
        ].join(' ')}
      />
    )
  }

  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none',
        sizeClasses[size],
        colorClass,
      ].join(' ')}
      aria-label={name}
      title={name}
      suppressHydrationWarning
    >
      {initials}
    </span>
  )
}
