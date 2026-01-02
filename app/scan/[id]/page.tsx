import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RefreshButton from '@/components/RefreshButton'
import CopyLinkButton from '@/components/CopyLinkButton'
import ExportPdfButton from '@/components/ExportPdfButton'
import ChecklistManuelle from '@/components/ChecklistManuelle'

interface PageProps {
  params: Promise<{ id: string }>
}

// Force le mode dynamique
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ScanResultPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer le scan
  const { data: scan, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !scan) {
    notFound()
  }

  // Si le scan est en cours - ENLEVER LE REFRESH AUTO
  if (scan.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Scan en cours...</p>
          <p className="text-gray-500 mt-2">Rafraîchissez la page dans quelques secondes</p>
          <RefreshButton />
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
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à l&apos;accueil
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

  // Calculs pour les nouvelles sections
  const tempsCorrectionMin = criticalCount * 30 + moderateCount * 15 + minorCount * 5
  const tempsCorrectionHeures = Math.floor(tempsCorrectionMin / 60)
  const tempsCorrectionMinutes = tempsCorrectionMin % 60

  // Détection des violations pour l'impact SEO
  const hasHtmlLang = violations.some(v => v.id === 'html-has-lang')
  const hasImageAlt = violations.some(v => v.id === 'image-alt')
  const hasHeadingOrder = violations.some(v => v.id === 'heading-order')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Retour à l&apos;accueil
            </Link>
            <div className="flex gap-2">
              <ExportPdfButton />
              <CopyLinkButton />
            </div>
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

            {/* Score amélioré avec graphique */}
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={scan.score >= 90 ? '#10b981' : scan.score >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(scan.score / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-900">{scan.score}</div>
                <div className="text-sm font-semibold text-gray-600">/100</div>
              </div>
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

        {/* 1. Priorisation par impact */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Priorisation par impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-2">🔴 Priorité 1</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{criticalCount}</div>
              <div className="text-sm text-gray-600">Problèmes critiques</div>
              <div className="text-xs text-gray-500 mt-2">À corriger en priorité</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-2">🟠 Priorité 2</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{moderateCount}</div>
              <div className="text-sm text-gray-600">Problèmes modérés</div>
              <div className="text-xs text-gray-500 mt-2">Important à corriger</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-2">🟡 Priorité 3</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{minorCount}</div>
              <div className="text-sm text-gray-600">Problèmes mineurs</div>
              <div className="text-xs text-gray-500 mt-2">À améliorer</div>
            </div>
          </div>
        </div>

        {/* 2. Estimation temps de correction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">⏱️ Estimation du temps de correction</h2>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-900 mb-2">
              {tempsCorrectionHeures > 0 ? `${tempsCorrectionHeures}h` : ''}
              {tempsCorrectionMinutes > 0 ? ` ${tempsCorrectionMinutes}min` : tempsCorrectionHeures === 0 ? `${tempsCorrectionMinutes}min` : ''}
            </div>
            <p className="text-gray-700">
              Temps estimé pour corriger tous les problèmes détectés
            </p>
            <p className="text-sm text-gray-600 mt-2">
              (Estimation basée sur : {criticalCount} critique × 30min + {moderateCount} modéré × 15min + {minorCount} mineur × 5min)
            </p>
          </div>
        </div>

        {/* 3. Impact SEO */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🚀 Impact sur le référencement (SEO)</h2>
          <ul className="space-y-2 text-gray-700">
            {scan.score >= 90 && (
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Votre score élevé est un signal positif pour Google</span>
              </li>
            )}
            {hasHtmlLang && (
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">⚠</span>
                <span>L&apos;attribut lang manquant peut impacter le référencement international</span>
              </li>
            )}
            {hasImageAlt && (
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">⚠</span>
                <span>Les images sans alt ne sont pas indexées par Google Images</span>
              </li>
            )}
            {hasHeadingOrder && (
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">⚠</span>
                <span>Une hiérarchie de titres correcte aide Google à comprendre votre contenu</span>
              </li>
            )}
            {!hasHtmlLang && !hasImageAlt && !hasHeadingOrder && scan.score < 90 && (
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Aucun impact SEO majeur détecté par ce scan</span>
              </li>
            )}
          </ul>
        </div>

        {/* 4. Conformité légale */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">⚖️ Conformité légale (RGAA/WCAG)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">RGAA (Référentiel Général d&apos;Amélioration de l&apos;Accessibilité)</h3>
              <p className="text-sm text-gray-700 mb-2">
                Obligatoire en France pour : services publics, entreprises de +250M€ CA, établissements recevant du public
              </p>
              <div className="flex items-center gap-2">
                {scan.score >= 90 ? (
                  <>
                    <span className="text-2xl">✓</span>
                    <span className="text-green-700 font-semibold">Conforme (score {scan.score}/100)</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">⚠</span>
                    <span className="text-orange-700 font-semibold">Non conforme (score {scan.score}/100)</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">WCAG 2.1 Level AA</h3>
              <p className="text-sm text-gray-700 mb-2">
                Standard international de référence pour l&apos;accessibilité web
              </p>
              <div className="flex items-center gap-2">
                {scan.score >= 90 ? (
                  <>
                    <span className="text-2xl">✓</span>
                    <span className="text-green-700 font-semibold">Conforme (score {scan.score}/100)</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">⚠</span>
                    <span className="text-orange-700 font-semibold">Non conforme (score {scan.score}/100)</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3 mt-4">
              <p className="text-xs text-purple-900">
                <strong>Note :</strong> En cas de non-conformité, des amendes allant jusqu&apos;à 25 000€ peuvent être appliquées en France.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Utilisateurs impactés */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">👥 Utilisateurs impactés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-1">15%</div>
              <div className="text-sm text-gray-600">Population mondiale handicapée</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-1">8%</div>
              <div className="text-sm text-gray-600">Hommes daltoniens</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-1">2.2M</div>
              <div className="text-sm text-gray-600">Malvoyants en France</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Bénéficient d&apos;un site accessible</div>
            </div>
          </div>
        </div>

        {/* 6. Comparaison sectorielle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📈 Comparaison sectorielle</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Votre score</span>
                <span className="text-sm font-bold text-gray-900">{scan.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    scan.score >= 90 ? 'bg-green-600' : scan.score >= 50 ? 'bg-orange-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${scan.score}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Moyenne e-commerce</span>
                <span className="text-sm font-bold text-gray-900">65/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="h-4 bg-gray-400 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Top 10% des sites</span>
                <span className="text-sm font-bold text-gray-900">92/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="h-4 bg-green-600 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            {scan.score >= 92 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-center">
                <span className="text-2xl mr-2">🏆</span>
                <span className="font-semibold text-yellow-900">Félicitations ! Vous êtes dans le top 10%</span>
              </div>
            )}
          </div>
        </div>

        {/* 7. Checklist vérifications manuelles */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">✅ Checklist de vérifications manuelles</h2>
          <p className="text-sm text-gray-600 mb-4">
            Le scan automatique ne détecte que 30-40% des problèmes. Vérifiez manuellement ces points :
          </p>
          <ChecklistManuelle />
        </div>

        {/* 8. Outils complémentaires */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔧 Outils complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Extensions navigateur</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://wave.webaim.org/extension/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    WAVE (Web Accessibility Evaluation Tool)
                  </a>
                </li>
                <li>
                  <a href="https://www.deque.com/axe/devtools/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    axe DevTools
                  </a>
                </li>
                <li>
                  <a href="https://accessibilityinsights.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Accessibility Insights
                  </a>
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Lecteurs d&apos;écran</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.nvaccess.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    NVDA (Windows, gratuit)
                  </a>
                </li>
                <li>
                  <a href="https://www.apple.com/accessibility/vision/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    VoiceOver (macOS/iOS, intégré)
                  </a>
                </li>
                <li>
                  <a href="https://support.google.com/accessibility/android/answer/6283677" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    TalkBack (Android, intégré)
                  </a>
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    WCAG 2.1 (Guide de référence)
                  </a>
                </li>
                <li>
                  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    RGAA (Référentiel français)
                  </a>
                </li>
                <li>
                  <a href="https://www.accede-web.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    AcceDe Web (Guides pratiques)
                  </a>
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Vérificateurs de contraste</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    WebAIM Contrast Checker
                  </a>
                </li>
                <li>
                  <a href="https://colorable.jxnblk.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Colorable
                  </a>
                </li>
              </ul>
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
                    
                    <p className="text-sm text-gray-500 mb-3">
                      📋 Critère : <span className="font-medium">{violation.wcag}</span>
                    </p>

                    {/* Exemples de code */}
                    {violation.exemples && violation.exemples.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 mb-2">
                          💻 Voir des exemples de code
                        </summary>
                        <div className="mt-2 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-green-400 text-xs font-mono">
                            {violation.exemples.map((exemple: string, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0">{exemple}</div>
                            ))}
                          </pre>
                        </div>
                      </details>
                    )}
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

        {/* CTA */}
        <div className="print:hidden mt-8 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Sauvegardez vos rapports et suivez vos progrès
          </h2>
          <p className="mb-6 text-blue-100">
            Créez un compte gratuit pour conserver l&apos;historique de vos scans.
          </p>
          <Link 
            href="/auth/login"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </main>
    </div>
  )
}
