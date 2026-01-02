import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: scan } = await supabase
    .from('scans')
    .select('status')
    .eq('id', id)
    .single()

  return NextResponse.json({ status: scan?.status || 'pending' })
}
