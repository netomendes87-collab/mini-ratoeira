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

  // BUSCA O CLICK ORIGINAL

  const {
    data: clickData,
    error: clickError
  } = await supabase
    .from('clicks')
    .select('*')
    .eq('click_id', click_id)
    .single()
  
  console.log('CLICK_ID:', click_id)
  console.log('CLICK_DATA:', clickData)
  console.log('CLICK_ERROR:', clickError)  
  
  if (clickError) {

    console.error(clickError)

    return NextResponse.json({
      error: 'click not found'
    })

  }

  const { error } =
    await supabase
      .from('conversions')
      .insert([
        {
          click_id,

          campanha:
            clickData.campanha,

          dispositivo:
            clickData.dispositivo,

          ip:
            clickData.ip,

          utm_source:
            clickData.utm_source,

          utm_campaign:
            clickData.utm_campaign,

          utm_term:
            clickData.utm_term,

          fbclid:
            clickData.fbclid,

          gclid:
            clickData.gclid,

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