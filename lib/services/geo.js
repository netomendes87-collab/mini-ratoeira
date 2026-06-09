export function buildGeoPerformance(
  filteredClicks,
  filteredConversions
) {

  const geoPerformance = {}

  filteredClicks.forEach((click) => {

    const country =
      click.pais || 'Desconhecido'

    if (!geoPerformance[country]) {

      geoPerformance[country] = {
        clicks: 0,
        conversions: 0,
        revenue: 0,
        spend: 0
      }

    }

    geoPerformance[country]
      .clicks++

  })

  filteredConversions.forEach((conv) => {

    const click =
      filteredClicks.find(
        (c) =>
          c.click_id ===
          conv.click_id
      )

    if (!click) return

    const country =
      click.pais || 'Desconhecido'

    if (!geoPerformance[country]) {

      geoPerformance[country] = {
        clicks: 0,
        conversions: 0,
        revenue: 0,
        spend: 0
      }

    }

    geoPerformance[country]
      .conversions++

    geoPerformance[country]
      .revenue +=
        Number(conv.payout || 0)

  })

  return geoPerformance

}

export function buildMapData(
  geoPerformance
) {

  const mapData = []

  Object.entries(geoPerformance)
    .forEach(([country, data]) => {

      let coordinates = [-40, 0]

      if (country === 'Brazil') {
        coordinates = [-51, -14]
      }

      if (country === 'United Kingdom') {
        coordinates = [-3, 55]
      }

      if (country === 'United States') {
        coordinates = [-95, 38]
      }

      mapData.push({
        country,
        clicks: data.clicks,
        coordinates
      })

    })

  return mapData

}