'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshOnPending() {
  const router = useRouter()

  useEffect(() => {
    // Refresh toutes les 2 secondes
    const interval = setInterval(() => {
      router.refresh()
    }, 2000)

    return () => clearInterval(interval)
  }, [router])

  return null
}

