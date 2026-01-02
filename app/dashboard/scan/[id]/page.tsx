import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ExportPdfButton from '@/components/ExportPdfButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardScanPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Vérifier authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Récupérer le scan (seulement ceux de l'utilisateur)
  const { data: scan, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !scan) notFound()

  // Si le scan est en cours
  if (scan.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Scan en cours...</p>
          <p className="text-gray-500 mt-2">Cela peut prendre 30 à 60 secondes</p>
        </div>
      </div>
    )
  }

  // Si le scan a échoué
  if (scan.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Échec du scan</h1>
          <p className="text-gray-600 mb-6">
            Impossible d&apos;analyser cette URL. Vérifiez qu&apos;elle est accessible publiquement.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Déterminer la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-600 bg-green-50'
    if (score >= 50) return 'text-orange-600 border-orange-600 bg-orange-50'
    return 'text-red-600 border-red-600 bg-red-50'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Conforme'
    if (score >= 50) return 'Partiellement conforme'
    return 'Non conforme'
  }

  // Compter les violations par impact
  const violations = scan.violations as any[]
  const criticalCount = violations.filter(v => v.impact === 'critique').length
  const moderateCount = violations.filter(v => v.impact === 'modéré').length
  const minorCount = violations.filter(v => v.impact === 'mineur').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Retour au dashboard
            </Link>
            <ExportPdfButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header du rapport */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Rapport d&apos;accessibilité
              </h1>
              <p className="text-gray-600 break-all">{scan.url}</p>
              <p className="text-sm text-gray-500 mt-1">
                Scanné le {new Date(scan.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Score */}
            <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(scan.score)}`}>
              <div className="text-4xl font-bold">{scan.score}</div>
              <div className="text-sm font-semibold">/100</div>
            </div>
          </div>

          <div className="mt-4 text-center md:text-left">
            <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getScoreColor(scan.score)}`}>
              {getScoreLabel(scan.score)}
            </span>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Résumé</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{violations.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total de problèmes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">🔴 {criticalCount}</div>
              <div className="text-sm text-gray-600 mt-1">Critiques</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">🟠 {moderateCount}</div>
              <div className="text-sm text-gray-600 mt-1">Modérés</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">🟡 {minorCount}</div>
              <div className="text-sm text-gray-600 mt-1">Mineurs</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Important :</strong> Ce scan automatique détecte une partie des problèmes d&apos;accessibilité, mais ne remplace pas un audit manuel complet. Certains critères WCAG/RGAA nécessitent une vérification humaine.
          </p>
        </div>

        {/* Liste des violations */}
        {violations.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Problèmes détectés</h2>
            {violations.map((violation, index) => (
              <div key={index} className="violation-item bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {violation.impact === 'critique' ? '🔴' : violation.impact === 'modéré' ? '🟠' : '🟡'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {violation.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        violation.impact === 'critique' ? 'bg-red-100 text-red-700' :
                        violation.impact === 'modéré' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {violation.impact.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{violation.description}</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-blue-900 mb-1">💡 Comment corriger :</p>
                      <p className="text-sm text-blue-800">{violation.help}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      📋 Critère : <span className="font-medium">{violation.wcag}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Aucun problème détecté !
            </h2>
            <p className="text-green-700">
              Votre site semble conforme aux tests automatiques d&apos;accessibilité.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

