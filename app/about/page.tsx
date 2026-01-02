import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">À propos du scanner</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-gray-700 mb-4">
            Notre scanner utilise <strong>Google Lighthouse</strong>, l&apos;outil d&apos;audit 
            officiel de Google, pour analyser l&apos;accessibilité de votre site web selon les 
            standards <strong>WCAG 2.1</strong> (Web Content Accessibility Guidelines).
          </p>
          <p className="text-gray-700">
            Le RGAA (Référentiel Général d&apos;Amélioration de l&apos;Accessibilité) étant basé 
            sur WCAG 2.1, les résultats sont également pertinents pour la conformité RGAA.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Le scan remplace-t-il un audit complet ?
              </h3>
              <p className="text-gray-700">
                Non. Ce scan automatique détecte environ 30-40% des problèmes d&apos;accessibilité. 
                Un audit manuel par un expert est nécessaire pour une conformité complète WCAG/RGAA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Mon site a un bon score, est-il accessible ?
              </h3>
              <p className="text-gray-700">
                Un bon score (90+) est un excellent début, mais certains critères comme la qualité 
                des textes alternatifs ou la logique de navigation nécessitent une évaluation humaine.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Combien de scans puis-je faire ?
              </h3>
              <p className="text-gray-700">
                Le plan gratuit permet 5 scans par mois. Créez un compte pour suivre vos scans 
                et voir l&apos;évolution de vos scores.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Les données sont-elles stockées ?
              </h3>
              <p className="text-gray-700">
                Les résultats de scans publics (sans compte) sont accessibles pendant 30 jours. 
                Les scans des utilisateurs connectés sont conservés indéfiniment dans leur historique.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Besoin d&apos;aide ?</h2>
          <p className="text-gray-700 mb-4">
            Pour un audit complet ou des questions sur l&apos;accessibilité
          </p>
          <a 
            href="mailto:contact@example.com" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nous contacter
          </a>
        </div>
      </main>
    </div>
  )
}

