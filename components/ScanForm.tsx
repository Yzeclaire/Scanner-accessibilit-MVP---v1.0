'use client'

import { useState } from 'react'

export default function ScanForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('L\'URL doit commencer par http:// ou https://')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du scan')
      }

      // Polling : vérifier le statut toutes les 2 secondes
      const checkStatus = async () => {
        const checkResponse = await fetch(`/api/scan/${data.scanId}/status`)
        const checkData = await checkResponse.json()
        
        if (checkData.status === 'completed') {
          window.location.href = `/scan/${data.scanId}`
        } else if (checkData.status === 'failed') {
          setError('Le scan a échoué')
          setLoading(false)
        } else {
          // Réessayer dans 2 secondes
          setTimeout(checkStatus, 2000)
        }
      }

      // Commencer à vérifier le statut
      setTimeout(checkStatus, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemple.com"
          className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? 'Scan...' : 'Scanner'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          ⏳ Analyse en cours... 30-60 secondes
        </div>
      )}
    </form>
  )
}
