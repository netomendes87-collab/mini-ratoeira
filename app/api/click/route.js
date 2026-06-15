```js
import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export async function GET(req) {

  const { searchParams } =
    new URL(req.url)

  const campanha =
    searchParams.get('campanha')

  const gclid =
    searchParams.get('gclid')

  const offer =
    searchParams.get('offer')

  const clickId =
    crypto.randomUUID()

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

    console.error(error)

    return NextResponse.json({
      error
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

}
```
