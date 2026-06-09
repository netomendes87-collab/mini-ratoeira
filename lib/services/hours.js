export function buildHourStats(
  filteredClicks,
  filteredConversions
) {

  const hourStats = {}

  filteredClicks.forEach((click) => {

    const date = new Date(
      click.created_at || click.date
    )

    const hour =
      `${date.getHours()}:00`

    if (!hourStats[hour]) {

      hourStats[hour] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    hourStats[hour].clicks++

  })

  filteredConversions.forEach((conv) => {

    const click = filteredClicks.find(
      (c) => c.click_id === conv.click_id
    )

    if (!click) return

    const date = new Date(
      click.created_at || click.date
    )

    const hour =
      `${date.getHours()}:00`

    if (!hourStats[hour]) {

      hourStats[hour] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }

    }

    hourStats[hour].conversions++

    hourStats[hour].revenue +=
      Number(conv.payout || 0)

  })

  return hourStats

}