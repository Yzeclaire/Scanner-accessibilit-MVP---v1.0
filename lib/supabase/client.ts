import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug: vérifier les variables d'environnement
  if (typeof window !== 'undefined') {
    console.log('[Client] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Défini' : '✗ Non défini')
    console.log('[Client] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Défini' : '✗ Non défini')
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes. ' +
      `URL: ${supabaseUrl ? '✓' : '✗'}, Key: ${supabaseAnonKey ? '✓' : '✗'}`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

