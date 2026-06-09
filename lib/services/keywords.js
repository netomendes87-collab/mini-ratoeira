export function buildKeywordStats(
  filteredClicks,
  filteredConversions
) {

  const keywordStats = {}

  filteredClicks.forEach((click) => {

    if (!click.utm_term) return

    const keyword = click.utm_term

    if (!keywordStats[keyword]) {

      keywordStats[keyword] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    keywordStats[keyword].clicks++

  })

  filteredConversions.forEach((conv) => {

    const click = filteredClicks.find(
      (c) => c.click_id === conv.click_id
    )

    if (!click?.utm_term) return

    const keyword = click.utm_term

    if (!keywordStats[keyword]) {

      keywordStats[keyword] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    keywordStats[keyword].conversions++

    keywordStats[keyword].revenue +=
      Number(conv.payout || 0)

  })

  return keywordStats

}