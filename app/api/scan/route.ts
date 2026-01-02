import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTranslatedViolation } from '@/lib/translations'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'URL invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Vérifier limite si authentifié
    if (user) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: scans } = await supabase
        .from('scans')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (scans && scans.length >= 5) {
        return NextResponse.json(
          { error: 'Limite de 5 scans/mois atteinte' },
          { status: 429 }
        )
      }
    }

    // Créer scan
    const { data: scan, error: insertError } = await supabase
      .from('scans')
      .insert({
        user_id: user?.id || null,
        url,
        status: 'pending',
        score: 0,
        violations: []
      })
      .select()
      .single()

    if (insertError || !scan) {
      return NextResponse.json(
        { error: 'Erreur création scan' },
        { status: 500 }
      )
    }

    // Appel PageSpeed
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=accessibility&key=${apiKey}`
    
    const pageSpeedResponse = await fetch(apiUrl)
    
    if (!pageSpeedResponse.ok) {
      await supabase
        .from('scans')
        .update({ status: 'failed' })
        .eq('id', scan.id)

      return NextResponse.json(
        { error: 'Impossible d\'analyser cette URL' },
        { status: 400 }
      )
    }

    const pageSpeedData = await pageSpeedResponse.json()
    const lighthouseResult = pageSpeedData.lighthouseResult
    
    const accessibilityScore = Math.round((lighthouseResult.categories.accessibility.score || 0) * 100)
    const audits = lighthouseResult.audits

    // Traiter violations
    const violations: any[] = []
    
    for (const [auditId, auditData] of Object.entries(audits)) {
      const audit = auditData as any
      
      if (audit.score !== null && audit.score !== undefined && audit.score < 1) {
        let impact = 'mineur'
        if (audit.score < 0.5) impact = 'critique'
        else if (audit.score < 0.9) impact = 'modéré'

        const translated = getTranslatedViolation(auditId, audit)

        violations.push({
          id: auditId,
          impact,
          title: translated.title,
          description: translated.description,
          help: translated.help,
          wcag: translated.wcag,
          score: audit.score
        })
      }
    }

    const impactOrder: { [key: string]: number } = { critique: 0, modéré: 1, mineur: 2 }
    violations.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact])

    // Mise à jour
    await supabase
      .from('scans')
      .update({
        status: 'completed',
        score: accessibilityScore,
        violations: violations
      })
      .eq('id', scan.id)

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      score: accessibilityScore,
      violationsCount: violations.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
