'use client'

import { useState } from 'react'

export default function ChecklistManuelle() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const items = [
    'Les textes alternatifs des images sont-ils descriptifs et pertinents ?',
    'La navigation au clavier fonctionne-t-elle sur tous les éléments interactifs ?',
    'Les vidéos ont-elles des sous-titres et des transcriptions ?',
    'Les messages d\'erreur sont-ils clairs et indiquent-ils comment corriger ?',
    'Les animations peuvent-elles être désactivées (prefers-reduced-motion) ?',
    'Le site est-il testé avec un lecteur d\'écran (NVDA, JAWS, VoiceOver) ?',
    'Les intitulés de liens sont-ils explicites hors contexte ?'
  ]

  const toggleCheck = (index: number) => {
    setChecked(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <label
          key={index}
          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <input
            type="checkbox"
            checked={checked[index] || false}
            onChange={() => toggleCheck(index)}
            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="flex-1 text-gray-700">{item}</span>
        </label>
      ))}
    </div>
  )
}

