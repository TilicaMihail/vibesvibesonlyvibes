const GRADIENTS: [string, string][] = [
  ['#a27246', '#7a5530'],
  ['#c4a882', '#a27246'],
  ['#29241f', '#4a3728'],
  ['#7a5530', '#29241f'],
  ['#c4a882', '#7a5530'],
  ['#4a3728', '#29241f'],
  ['#a27246', '#4a3728'],
  ['#c4a882', '#29241f'],
]

function pickGradient(id: string): [string, string] {
  const sum = id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return GRADIENTS[sum % GRADIENTS.length]
}

interface CardBannerProps {
  id: string
  title: string
  height?: string
}

export default function CardBanner({ id, title, height = 'h-32' }: CardBannerProps) {
  const [from, to] = pickGradient(id)
  const letter = title.trim()[0]?.toUpperCase() ?? '?'

  return (
    <div
      className={`${height} relative overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* Dot-grid pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15 }}
        aria-hidden
      >
        <defs>
          <pattern id={`dots-${id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#f6f3e7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
      </svg>

      {/* Ghost letter */}
      <span
        className="absolute right-3 bottom-0 leading-none font-bold select-none pointer-events-none"
        style={{ fontSize: '5rem', color: '#f6f3e7', opacity: 0.18, lineHeight: 1 }}
        aria-hidden
      >
        {letter}
      </span>
    </div>
  )
}
