'use client'

export default function CopyLinkButton() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('✅ Lien copié dans le presse-papier !')
  }

  return (
    <button 
      onClick={copyLink}
      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
    >
      📋 Partager ce rapport
    </button>
  )
}

