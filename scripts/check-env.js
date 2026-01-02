// Script pour vérifier les variables d'environnement
// Exécutez avec: node scripts/check-env.js

require('dotenv').config({ path: '.env.local' })

console.log('\n=== Vérification des variables d\'environnement ===\n')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY

console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? `✓ ${url.substring(0, 30)}...` : '✗ Non défini')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? `✓ ${key.substring(0, 20)}...` : '✗ Non défini')
console.log('GOOGLE_PAGESPEED_API_KEY:', apiKey ? `✓ ${apiKey.substring(0, 20)}...` : '✗ Non défini')

if (!url || !key) {
  console.log('\n❌ ERREUR: Variables Supabase manquantes!')
  console.log('\nVérifiez que votre fichier .env.local contient:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-ici')
  process.exit(1)
} else {
  console.log('\n✅ Toutes les variables sont définies!')
}

