'use client'

interface BadgeCardProps {
  emoji: string
  title: string
  description: string
  unlocked: boolean
}

export default function BadgeCard({ emoji, title, description, unlocked }: BadgeCardProps) {
  return (
    <div
      className={`
        relative border rounded-lg p-4 text-center transition-all
        ${unlocked 
          ? 'bg-white border-blue-200 shadow-sm hover:shadow-md' 
          : 'bg-gray-50 border-gray-200 opacity-60'
        }
      `}
      title={description}
    >
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
        {emoji}
      </div>
      <div className={`text-sm font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {title}
      </div>
      {unlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-xs text-green-600">✓</span>
        </div>
      )}
    </div>
  )
}

