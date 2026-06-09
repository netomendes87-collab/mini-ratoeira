export function buildDailyStats(
  filteredClicks,
  filteredConversions,
  campaigns
) {

  const dailyStats = {}

  filteredClicks.forEach((click) => {

    const date = new Date(
      click.created_at || click.date
    )

    const day =
      date.toISOString().split('T')[0]

    if (!dailyStats[day]) {

      dailyStats[day] = {
        revenue: 0,
        spend: 0,
        clicks: 0,
        conversions: 0
      }

    }

    dailyStats[day].clicks++

  })

  filteredConversions.forEach((conv) => {

    const click = filteredClicks.find(
      (c) => c.click_id === conv.click_id
    )

    if (!click) return

    const date = new Date(
      click.created_at || click.date
    )

    const day =
      date.toISOString().split('T')[0]

    if (!dailyStats[day]) {

      dailyStats[day] = {
        revenue: 0,
        spend: 0,
        clicks: 0,
        conversions: 0
      }

    }

    dailyStats[day].conversions++

    dailyStats[day].revenue +=
      Number(conv.payout || 0)

  })

  campaigns.forEach((campaign) => {

    const spend =
      Number(campaign.spend || 0)

    const day =
      new Date()
        .toISOString()
        .split('T')[0]

    if (!dailyStats[day]) {

      dailyStats[day] = {
        revenue: 0,
        spend: 0,
        clicks: 0,
        conversions: 0
      }

    }

    dailyStats[day].spend += spend

  })

  return dailyStats

}