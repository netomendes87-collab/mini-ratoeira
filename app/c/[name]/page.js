import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function RedirectPage({
  params,
  searchParams
}) {

const resolvedParams = await params
const resolvedSearchParams = await searchParams

const name = resolvedParams.name

  // BUSCA CAMPANHA
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .ilike('name', name)
    .single()

  // SE NÃO ENCONTRAR
  if (error || !data) {
    return (
      <div
        style={{
          background: '#020c2b',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'Arial'
        }}
      >
        <h1>Campanha não encontrada</h1>
      </div>
    )
  }

  // CONTABILIZA CLICK
const utmSource =
  resolvedSearchParams?.utm_source || null

const utmCampaign =
  resolvedSearchParams?.utm_campaign || null

const utmTerm =
  resolvedSearchParams?.utm_term || null

const utmContent =
  resolvedSearchParams?.utm_content || null

const utmMedium =
  resolvedSearchParams?.utm_medium || null

  const gclid =
  resolvedSearchParams?.gclid || null

const fbclid =
  resolvedSearchParams?.fbclid || null

const headersList = await headers()

const userAgent =
  headersList.get('user-agent') || ''

const isMobile =
  /mobile/i.test(userAgent)

const dispositivo =
  isMobile ? 'mobile' : 'desktop'

const navegador =
  userAgent.includes('Chrome')
    ? 'Chrome'
    : userAgent.includes('Firefox')
    ? 'Firefox'
    : 'Outro'

const os =
  userAgent.includes('Windows')
    ? 'Windows'
    : userAgent.includes('Android')
    ? 'Android'
    : userAgent.includes('iPhone')
    ? 'iPhone'
    : 'Outro'

const ip =
  headersList.get('x-forwarded-for') || 'localhost'
const pais =
  ip.includes('127.0.0.1') ||
  ip.includes('localhost') ||
  ip.includes('::1')
    ? 'Brasil'
    : 'Desconhecido'
const { error: insertError } = await supabase
  .from('clicks')
  .insert([
  {
    campanha: data.name,
    palavra_chave: data.name,
    dispositivo,
    navegador,
    os,
    ip,
    pais,

    utm_source: utmSource,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    utm_medium: utmMedium,

    gclid,
    fbclid
  }
])



return (
    <div
      style={{
        background: '#020c2b',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial'
      }}
    >
      <div
        style={{
          background: '#14213d',
          padding: '40px',
          borderRadius: '20px',
          width: '420px',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(0,0,0,0.4)'
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>
          🚀 {data.name}
        </h1>

        <p
          style={{
            color: '#9fb3ff',
            marginBottom: '30px'
          }}
        >
          Oferta cadastrada no Supabase
        </p>

        <a
          href={data.offer}
          target="_blank"
          style={{
            background: '#4ade80',
            color: '#000',
            padding: '14px 25px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          🔥 Abrir Oferta
        </a>
      </div>
    </div>
  )
}