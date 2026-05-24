import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export async function GET(req) {

  const { searchParams } =
  new URL(req.url)

const campanha =
  searchParams.get('campanha')

const offer =
  searchParams.get('offer')

const fbclid =
  searchParams.get('fbclid')

const gclid =
  searchParams.get('gclid')

const ttclid =
  searchParams.get('ttclid')

const sub1 =
  searchParams.get('sub1')

const sub2 =
  searchParams.get('sub2')

const sub3 =
  searchParams.get('sub3')

const sub4 =
  searchParams.get('sub4')

const sub5 =
  searchParams.get('sub5')  

const palavra_chave =
  searchParams.get('keyword')  

const utm_source =
  searchParams.get('utm_source')

const utm_campaign =
  searchParams.get('utm_campaign')

const utm_content =
  searchParams.get('utm_content')

const utm_term =
  searchParams.get('utm_term')

const userAgent =
  req.headers.get('user-agent') || ''

const dispositivo =
  /mobile/i.test(userAgent)
    ? 'mobile'
    : 'desktop'


let navegador = 'Unknown'

if (userAgent.includes('Chrome')) {
  navegador = 'Chrome'
}

else if (userAgent.includes('Firefox')) {
  navegador = 'Firefox'
}

else if (userAgent.includes('Safari')) {
  navegador = 'Safari'
}

else if (userAgent.includes('Edge')) {
  navegador = 'Edge'
}

let os = 'Unknown'

if (userAgent.includes('Windows')) {
  os = 'Windows'
}

else if (userAgent.includes('Android')) {
  os = 'Android'
}

else if (userAgent.includes('iPhone')) {
  os = 'iPhone'
}

else if (userAgent.includes('Mac')) {
  os = 'MacOS'
}
const ip =
  req.headers.get('x-forwarded-for') ||
  'unknown'

let pais = 'Unknown'
let cidade = 'Unknown'
let regiao = 'Unknown'
let isp = 'Unknown'

try {

  const geoRes = await fetch(
    `http://ip-api.com/json/${ip}`
  )

  const geoData =
    await geoRes.json()

  pais =
    geoData.country || 'Unknown'

  cidade =
    geoData.city || 'Unknown'

  regiao =
    geoData.regionName || 'Unknown'

  isp =
    geoData.isp || 'Unknown'

} catch (err) {

  console.error(
    'Erro GEO:',
    err
  )

}

const clickId =
  crypto.randomUUID()
let source = 'Direct'

if (fbclid) {
  source = 'Facebook'
}

else if (gclid) {
  source = 'Google'
}

else if (ttclid) {
  source = 'TikTok'
}
  const { error } = await supabase
  .from('clicks')
  .insert([
      {
        click_id: clickId,
    campanha,
    offer,

    utm_source: source,

    fbclid,
    gclid,
    ttclid,

    sub1,
    sub2,
    sub3,
    sub4,
    sub5,

    palavra_chave,

    
    utm_campaign,
    utm_content,
    utm_term,

    ip,
    dispositivo,

    navegador,
    os,

    pais,
cidade,
regiao,
isp,

      }
    ])
    
  if (error) {
  console.error(error)
}
  const redirectUrl = new URL(offer)

redirectUrl.searchParams.set(
  'click_id',
  clickId
)

return NextResponse.redirect(
  redirectUrl
)

}