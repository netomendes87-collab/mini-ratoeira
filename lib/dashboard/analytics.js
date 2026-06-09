export function calculateAnalytics({
  filteredClicks,
  filteredConversions
}) {

  const deviceStats = {}
  const browserStats = {}
  const osStats = {}
  const ispStats = {}

  filteredClicks.forEach((click) => {

    const device =
      click.dispositivo || 'Desconhecido'

    const browser =
      click.navegador || 'Desconhecido'

    const os =
      click.os || 'Desconhecido'

    const isp =
      click.isp || 'Desconhecido'

    if (!deviceStats[device]) {
      deviceStats[device] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    if (!browserStats[browser]) {
      browserStats[browser] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    if (!osStats[os]) {
      osStats[os] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    if (!ispStats[isp]) {
      ispStats[isp] = {
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    deviceStats[device].clicks++
    browserStats[browser].clicks++
    osStats[os].clicks++
    ispStats[isp].clicks++

  })

  filteredConversions.forEach((conv) => {

    const click = filteredClicks.find(
      (c) => c.click_id === conv.click_id
    )

    if (!click) return

    const payout =
      Number(conv.payout || 0)

    const device =
      click.dispositivo || 'Desconhecido'

    const browser =
      click.navegador || 'Desconhecido'

    const os =
      click.os || 'Desconhecido'

    const isp =
      click.isp || 'Desconhecido'

    deviceStats[device].conversions++
    deviceStats[device].revenue += payout

    browserStats[browser].conversions++
    browserStats[browser].revenue += payout

    osStats[os].conversions++
    osStats[os].revenue += payout

    ispStats[isp].conversions++
    ispStats[isp].revenue += payout

  })

  return {
    deviceStats,
    browserStats,
    osStats,
    ispStats
  }

}