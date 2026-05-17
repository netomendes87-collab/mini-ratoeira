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

  const { error } = await supabase
    .from('conversions')
    .insert([
  {
    click_id: clickId,
    payout: Number(payout || 0)
  }
])

  if (error) {

    return Response.json({
      error
    })
  }

  return Response.json({
    success: true
  })
}
