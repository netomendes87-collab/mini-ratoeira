export function buildTrafficSources(filteredClicks) {

  const trafficSources = {}

  filteredClicks.forEach((click) => {

    const source =
      click.traffic_source || 'Direct'

    trafficSources[source] =
      (trafficSources[source] || 0) + 1

  })

  return trafficSources

}