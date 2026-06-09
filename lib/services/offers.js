export function buildOfferPerformance(
  filteredClicks,
  filteredConversions
) {

  const offerPerformanceAI = {}

  filteredClicks.forEach((click) => {

    const offer =
      click.offer || 'Sem Oferta'

    if (!offerPerformanceAI[offer]) {

      offerPerformanceAI[offer] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    offerPerformanceAI[offer]
      .clicks++

  })

  filteredConversions.forEach((conv) => {

    const click =
      filteredClicks.find(
        (c) =>
          c.click_id === conv.click_id
      )

    if (!click) return

    const offer =
      click.offer || 'Sem Oferta'

    if (!offerPerformanceAI[offer]) {

      offerPerformanceAI[offer] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    offerPerformanceAI[offer]
      .conversions++

    offerPerformanceAI[offer]
      .revenue +=
        Number(conv.payout || 0)

  })

  return offerPerformanceAI

}