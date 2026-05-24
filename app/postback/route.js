import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {

  const { searchParams } =
    new URL(request.url)

  const clickId =
    searchParams.get('click_id')

  const payout =
    searchParams.get('payout')

  if (!clickId) {

    return Response.json({
      error: 'click_id obrigatório'
    })
  }

  // BUSCA O CLICK ORIGINAL

  const { data: clickData } =
    await supabase
      .from('clicks')
      .select('*')
      .eq('click_id', clickId)
      .single()

  if (!clickData) {

    return Response.json({
      error: 'click não encontrado'
    })
  }

  const { data: existingConversion } =
  await supabase
    .from('conversions')
    .select('*')
    .eq('click_id', clickId)
    .single()

if (existingConversion) {

  return Response.json({
    success: false,
    message: 'conversão já existe'
  })
}
  // SALVA CONVERSÃO

  const { error } = await supabase
    .from('conversions')
    .insert([
      {
        click_id: clickId,

        payout: Number(
          payout || 0
        ),

        campanha:
          clickData.campanha,

        offer:
          clickData.offer,

        fbclid:
          clickData.fbclid,

        gclid:
          clickData.gclid,

        utm_source:
          clickData.utm_source,

        utm_campaign:
          clickData.utm_campaign,

        utm_content:
          clickData.utm_content,

        utm_term:
          clickData.utm_term,

        dispositivo:
          clickData.dispositivo,

        ip:
          clickData.ip
      }
    ])

  if (error) {

    console.error(error)

    return Response.json({
      error
    })
  }

  return Response.json({
    success: true
  })
}