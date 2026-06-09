export function calculateAlerts(
  campaignStats
) {

  const alerts = []

  Object.entries(campaignStats)
    .forEach(([campaign, data]) => {

      const profit =
        data.revenue -
        data.spend

      const roi =
        data.spend > 0
          ? (
              profit /
              data.spend
            ) * 100
          : 0

      const cr =
        data.clicks > 0
          ? (
              data.conversions /
              data.clicks
            ) * 100
          : 0

      const epc =
        data.clicks > 0
          ? data.revenue /
            data.clicks
          : 0

      if (
        data.spend >= 20 &&
        data.conversions === 0
      ) {

        alerts.push({
          type: '🔴',
          message:
            `${campaign} queimando dinheiro`
        })

      }

      if (cr > 20) {

        alerts.push({
          type: '🟢',
          message:
            `${campaign} pronta para escalar`
        })

      }

      if (
        cr < 5 &&
        data.clicks >= 10
      ) {

        alerts.push({
          type: '🟠',
          message:
            `${campaign} CR muito baixo`
        })

      }

      if (
        epc < 0.2 &&
        data.clicks >= 10
      ) {

        alerts.push({
          type: '🟡',
          message:
            `${campaign} EPC fraco`
        })

      }

    })

  return alerts

}