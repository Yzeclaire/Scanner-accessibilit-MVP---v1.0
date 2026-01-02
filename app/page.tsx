import Link from 'next/link'
import ScanForm from '@/components/ScanForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-900">♿ Scanner Accessibilité</h1>
          <Link 
            href="/auth/login" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Scanner d&apos;accessibilité<br />
            <span className="text-blue-600">WCAG/RGAA gratuit</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Testez la conformité de votre site web aux normes d&apos;accessibilité en quelques secondes
          </p>
          
          {/* Formulaire de scan */}
          <ScanForm />
          
          <p className="mt-4 text-sm text-gray-500">
            ⚠️ Ce scan automatique détecte une partie des problèmes, mais ne remplace pas un audit manuel complet
          </p>
        </div>
      </section>

      {/* Section Pourquoi l'accessibilité */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Pourquoi l&apos;accessibilité web ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚖️</div>
              <h4 className="text-xl font-semibold mb-3">Obligations légales</h4>
              <p className="text-gray-600">
                En France, le RGAA impose l&apos;accessibilité pour les services publics et grandes entreprises
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-xl font-semibold mb-3">UX améliorée</h4>
              <p className="text-gray-600">
                Un site accessible est plus facile à utiliser pour tous, y compris les 12 millions de personnes handicapées en France
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold mb-3">Meilleur SEO</h4>
              <p className="text-gray-600">
                Les bonnes pratiques d&apos;accessibilité améliorent votre référencement naturel sur Google
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Entrez votre URL</h4>
              <p className="text-gray-600">
                Collez l&apos;adresse de la page à analyser
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Analyse automatique</h4>
              <p className="text-gray-600">
                Notre outil scanne votre page en 30-60 secondes
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Recevez votre rapport</h4>
              <p className="text-gray-600">
                Consultez les problèmes détectés et les recommandations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Basé sur Google Lighthouse et standards WCAG 2.1 / RGAA
            </p>
            <Link href="/about" className="text-gray-400 hover:text-white">
              À propos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
