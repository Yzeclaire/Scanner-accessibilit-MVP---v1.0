'use client'

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <button 
      onClick={handleRefresh}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Rafraîchir
    </button>
  )
}

