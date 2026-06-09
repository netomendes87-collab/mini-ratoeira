export function calculateFraud(
  filteredClicks
) {

  const botClicks =
    filteredClicks.filter(
      (click) =>
        click.is_bot === true
    ).length

  const vpnClicks =
    filteredClicks.filter(
      (click) =>
        click.is_vpn === true
    ).length

  const proxyClicks =
    filteredClicks.filter(
      (click) =>
        click.is_proxy === true
    ).length

  const datacenterClicks =
    filteredClicks.filter(
      (click) =>
        click.is_datacenter === true
    ).length

  const cleanClicks =
    filteredClicks.length -
    botClicks -
    vpnClicks -
    proxyClicks -
    datacenterClicks

  const trafficScore =
    filteredClicks.length > 0

      ? Math.round(
          (
            cleanClicks /
            filteredClicks.length
          ) * 100
        )

      : 100

  let trafficQuality =
    '🟢 Excelente'

  if (trafficScore < 90) {
    trafficQuality =
      '🟡 Boa'
  }

  if (trafficScore < 70) {
    trafficQuality =
      '🟠 Atenção'
  }

  if (trafficScore < 50) {
    trafficQuality =
      '🔴 Alto Risco'
  }

  return {

    botClicks,

    vpnClicks,

    proxyClicks,

    datacenterClicks,

    cleanClicks,

    trafficScore,

    trafficQuality

  }

}