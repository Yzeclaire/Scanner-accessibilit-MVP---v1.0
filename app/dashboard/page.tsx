import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import NewScanButton from '@/components/NewScanButton'
import BadgeCard from '@/components/BadgeCard'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Calculer le début du mois
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Récupérer TOUS les scans de l'utilisateur (pour l'évolution)
  const { data: allScans } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Récupérer les 10 derniers scans pour la liste
  const scans = allScans?.slice(0, 10) || []

  // Compter les scans du mois en cours
  const { data: monthScans } = await supabase
    .from('scans')
    .select('id')
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  const scansThisMonth = monthScans?.length || 0
  const scansRemaining = Math.max(0, 5 - scansThisMonth)

  // Fonction pour déterminer la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 50) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  // Grouper les scans par URL
  const scansByUrl: Record<string, any[]> = {}
  allScans?.forEach(scan => {
    if (!scansByUrl[scan.url]) {
      scansByUrl[scan.url] = []
    }
    scansByUrl[scan.url].push(scan)
  })

  // Filtrer les URLs avec au moins 2 scans et trier par nombre de scans
  const urlsWithMultipleScans = Object.entries(scansByUrl)
    .filter(([_, scans]) => scans.length >= 2)
    .map(([url, scans]) => ({
      url,
      scans: scans.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }))
    .sort((a, b) => b.scans.length - a.scans.length)
    .slice(0, 3) // Top 3

  // Fonction pour générer le graphique SVG
  const generateChart = (urlScans: any[], width = 200, height = 60) => {
    if (!urlScans || urlScans.length < 2) return null

    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const scores = urlScans.map(s => s.score)
    const minScore = Math.min(...scores, 0)
    const maxScore = Math.max(...scores, 100)
    const scoreRange = maxScore - minScore || 100

    // Calculer la tendance (premier vs dernier score)
    const firstScore = urlScans[0].score
    const lastScore = urlScans[urlScans.length - 1].score
    const diff = lastScore - firstScore
    
    let lineColor = '#f59e0b' // orange par défaut (stable)
    if (diff > 5) lineColor = '#10b981' // vert (amélioration)
    else if (diff < -5) lineColor = '#ef4444' // rouge (dégradation)

    // Générer les points
    const points = urlScans.map((scan, index) => {
      const x = padding + (index / (urlScans.length - 1)) * chartWidth
      const y = padding + chartHeight - ((scan.score - minScore) / scoreRange) * chartHeight
      return `${x},${y}`
    }).join(' ')

    // Créer le path pour la ligne
    const pathData = points.split(' ').map((point, index) => {
      const [x, y] = point.split(',').map(Number)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return { pathData, lineColor, points: points.split(' ').map(p => p.split(',').map(Number)) }
  }

  // Calculer les badges
  const badges = {
    premierScan: (allScans?.length || 0) >= 1,
    serie5: scansThisMonth >= 5,
    scoreParfait: allScans?.some(scan => scan.score >= 95) || false,
    amelioration: (() => {
      // Vérifier si une URL a une amélioration de +10 points
      for (const [url, urlScans] of Object.entries(scansByUrl)) {
        if (urlScans.length >= 2) {
          const sortedScans = [...urlScans].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          const firstScore = sortedScans[0].score
          const lastScore = sortedScans[sortedScans.length - 1].score
          if (lastScore - firstScore >= 10) {
            return true
          }
        }
      }
      return false
    })(),
    rapide: (() => {
      // Vérifier si un utilisateur a re-scanné une URL en moins de 24h
      for (const [url, urlScans] of Object.entries(scansByUrl)) {
        if (urlScans.length >= 2) {
          const sortedScans = [...urlScans].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          for (let i = 1; i < sortedScans.length; i++) {
            const prevDate = new Date(sortedScans[i - 1].created_at).getTime()
            const currDate = new Date(sortedScans[i].created_at).getTime()
            const diffHours = (currDate - prevDate) / (1000 * 60 * 60)
            if (diffHours <= 24) {
              return true
            }
          }
        }
      }
      return false
    })()
  }

  const badgesList = [
    {
      id: 'premierScan',
      emoji: '🎯',
      title: 'Premier scan',
      description: 'Débloqué après votre premier scan',
      unlocked: badges.premierScan
    },
    {
      id: 'serie5',
      emoji: '🔥',
      title: 'Série de 5',
      description: 'Effectuez 5 scans dans le même mois',
      unlocked: badges.serie5
    },
    {
      id: 'scoreParfait',
      emoji: '🏆',
      title: 'Score parfait',
      description: 'Obtenez un score de 95/100 ou plus sur un scan',
      unlocked: badges.scoreParfait
    },
    {
      id: 'amelioration',
      emoji: '📈',
      title: 'Amélioration',
      description: 'Augmentez le score de +10 points sur une même URL',
      unlocked: badges.amelioration
    },
    {
      id: 'rapide',
      emoji: '⚡',
      title: 'Rapide',
      description: 'Corrigez et re-scannez une URL en moins de 24h',
      unlocked: badges.rapide
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-blue-900">
              ♿ Scanner Accessibilité
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Dashboard</h1>
          <p className="text-gray-600">Gérez et suivez vos scans d&apos;accessibilité</p>
        </div>

        {/* Carte quota */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Plan gratuit</h3>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                GRATUIT
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {scansThisMonth}/5
            </div>
            <p className="text-sm text-gray-600">
              scans utilisés ce mois
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(scansThisMonth / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Scans restants</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {scansRemaining}
            </div>
            <p className="text-sm text-gray-600">
              scans disponibles
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total scans</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {scans?.length || 0}
            </div>
            <p className="text-sm text-gray-600">
              scans effectués
            </p>
          </div>
        </div>

        {/* Badges / Accomplissements */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🏅 Vos accomplissements</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badgesList.map((badge) => (
              <BadgeCard
                key={badge.id}
                emoji={badge.emoji}
                title={badge.title}
                description={badge.description}
                unlocked={badge.unlocked}
              />
            ))}
          </div>
        </div>

        {/* Évolution des scores */}
        {urlsWithMultipleScans.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">📈 Évolution de vos sites</h2>
            <div className="space-y-4">
              {urlsWithMultipleScans.map(({ url, scans }) => {
                const chart = generateChart(scans)
                const lastScore = scans[scans.length - 1].score
                const firstScore = scans[0].score
                const diff = lastScore - firstScore
                
                // Tronquer l'URL pour l'affichage
                const truncatedUrl = url.length > 50 ? url.substring(0, 47) + '...' : url

                if (!chart) return null

                return (
                  <div key={url} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate mb-1">
                          {truncatedUrl}
                        </div>
                        <div className="text-xs text-gray-500">
                          {scans.length} scan{scans.length > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Mini graphique */}
                        <div className="flex-shrink-0">
                          <svg width="200" height="60" className="block">
                            <defs>
                              <linearGradient id={`gradient-${url.replace(/[^a-zA-Z0-9]/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={chart.lineColor} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={chart.lineColor} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {/* Zone remplie sous la ligne */}
                            <path
                              d={`${chart.pathData} L ${chart.points[chart.points.length - 1][0]} ${60 - 20} L ${chart.points[0][0]} ${60 - 20} Z`}
                              fill={`url(#gradient-${url.replace(/[^a-zA-Z0-9]/g, '-')})`}
                            />
                            {/* Ligne */}
                            <path
                              d={chart.pathData}
                              fill="none"
                              stroke={chart.lineColor}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Points */}
                            {chart.points.map(([x, y], idx) => (
                              <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r="3"
                                fill={chart.lineColor}
                                stroke="white"
                                strokeWidth="1.5"
                              />
                            ))}
                          </svg>
                        </div>

                        {/* Dernier score */}
                        <div className="flex-shrink-0 text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(lastScore)}`}>
                            {lastScore}/100
                          </div>
                          {Math.abs(diff) > 5 && (
                            <div className={`text-xs mt-1 ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diff > 0 ? '↑' : '↓'} {Math.abs(diff)} pts
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bouton nouveau scan */}
        <div className="mb-6">
          <NewScanButton disabled={scansRemaining === 0} />
          {scansRemaining === 0 && (
            <p className="mt-2 text-sm text-red-600">
              ⚠️ Limite atteinte - Revenez le mois prochain ou attendez le renouvellement
            </p>
          )}
        </div>

        {/* Liste des scans */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Mes scans</h2>
          </div>

          {scans && scans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-md">
                          {scan.url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(scan.score)}`}>
                          {scan.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(scan.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/scan/${scan.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Voir
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun scan pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par scanner votre premier site web
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

