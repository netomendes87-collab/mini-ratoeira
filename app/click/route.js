import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { UAParser } from 'ua-parser-js'

export async function GET(request) {

  const { searchParams } = new URL(request.url)

  const gclid = searchParams.get('gclid')
  const campaign = searchParams.get('utm_campaign')
  const keyword = searchParams.get('utm_term')

  const userAgent =
    request.headers.get('user-agent') || ''

  const parser = new UAParser(userAgent)

  const device =
    parser.getDevice().type || 'desktop'

  const browser =
    parser.getBrowser().name || 'Desconhecido'

  const os =
    parser.getOS().name || 'Desconhecido'

  const ip =
    request.headers.get('x-forwarded-for') || '127.0.0.1'

  let country = 'Localhost'

  try {

    const response = await fetch(
      `https://ipapi.co/${ip}/json/`
    )

    const geo = await response.json()

    country =
      geo.country_name || 'Desconhecido'

  } catch (error) {

    console.log('Erro GEO:', error)

  }

  await supabase
    .from('clicks')
    .insert([
      {
        gclid: gclid || '',
        campaign: campaign || '',
        keyword: keyword || '',
        device: device,
        browser: browser,
        os: os,
        ip: ip,
        country: country
      }
    ])

  return NextResponse.redirect('https://google.com')
}