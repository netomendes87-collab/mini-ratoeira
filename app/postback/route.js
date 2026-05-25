import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export async function GET(req) {

  const { searchParams } =
    new URL(req.url)

  const click_id =
    searchParams.get('click_id')

  const payout =
    searchParams.get('payout')

  const revenue =
    searchParams.get('revenue')

  const status =
    searchParams.get('status')

  const network =
    searchParams.get('network')

  if (!click_id) {

    return NextResponse.json({
      error: 'missing click_id'
    })

  }

  const { error } =
    await supabase
      .from('conversions')
      .insert([
        {
          click_id,
          payout,
          revenue,
          status,
          network
        }
      ])

  if (error) {

    console.error(error)

    return NextResponse.json({
      error
    })

  }

  return NextResponse.json({
    success: true
  })

}