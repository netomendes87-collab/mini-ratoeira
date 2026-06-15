import { NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'

console.log(
  'URL:',
  process.env.NEXT_PUBLIC_SUPABASE_URL
)

console.log(
  'KEY:',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {

  try {

    const url = new URL(req.url)

    const searchParams = url.searchParams

    const campanha =
      searchParams.get('campanha')

    const gclid =
      searchParams.get('gclid')

    const offer =
      searchParams.get('offer')

    const clickId =
      crypto.randomUUID()

    console.log('CLICK RECEBIDO')

    const { error } =
      await supabase
        .from('clicks')
        .insert([
          {
            click_id: clickId,
            campanha,
            gclid
          }
        ])

    if (error) {

      console.error('ERRO SUPABASE:', error)

      return NextResponse.json({
        success: false,
        error
      })

    }

    console.log('CLICK SALVO')

    if (!offer) {

      return NextResponse.json({
        success: true,
        click_id: clickId
      })

    }

    const redirectUrl =
      new URL(offer)

    redirectUrl.searchParams.set(
      'subid',
      clickId
    )

    return NextResponse.redirect(
      redirectUrl
    )

  } catch (err) {

    console.error('ERRO API:', err)

    return NextResponse.json({
      success: false,
      error: String(err)
    })

  }

}