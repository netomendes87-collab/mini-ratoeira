export function calculateCampaigns({
  filteredClicks,
  filteredConversions,
  campaigns
}) {

  const campaignStats = {}

  filteredClicks.forEach((click) => {

    const campaign =
      click.campanha ||
      'Sem campanha'

    if (!campaignStats[campaign]) {

      campaignStats[campaign] = {

        clicks: 0,

        conversions: 0,

        revenue: 0,

        spend: 0

      }

    }

    campaignStats[campaign]
      .clicks++

  })

  filteredConversions.forEach((conv) => {

    const campaign =
      conv.campanha ||
      'Sem campanha'

    if (!campaignStats[campaign]) {

      campaignStats[campaign] = {

        clicks: 0,

        conversions: 0,

        revenue: 0,

        spend: 0

      }

    }

    campaignStats[campaign]
      .conversions++

    campaignStats[campaign]
      .revenue +=
        Number(conv.payout || 0)

  })

  campaigns.forEach((camp) => {

    const name = camp.name

    if (!campaignStats[name]) {

      campaignStats[name] = {

        clicks: 0,

        conversions: 0,

        revenue: 0,

        spend: 0

      }

    }

    campaignStats[name]
      .spend =
        Number(camp.spend || 0)

  })

  const aiCampaignScore = {}

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

      let status =
        '🟡 OBSERVAR'

      if (
        roi > 30 &&
        data.conversions > 0
      ) {

        status =
          '🟢 ESCALAR'

      }

      if (
        (
          data.spend >= 20 &&
          data.conversions === 0
        ) ||
        roi < 0
      ) {

        status =
          '🔴 PAUSAR'

      }

      aiCampaignScore[campaign] = {

        ...data,

        roi,

        profit,

        status

      }

    })

  const deadCampaigns =
    Object.entries(campaignStats)
      .filter(
        ([_, data]) =>
          data.spend > 0 &&
          data.conversions === 0
      )

  const negativeROI =
    Object.entries(campaignStats)
      .filter(
        ([_, data]) =>
          data.spend > 0 &&
          (
            (
              (
                data.revenue -
                data.spend
              ) /
              data.spend
            ) * 100
          ) < 0
      )

  return {

    campaignStats,

    aiCampaignScore,

    deadCampaigns,

    negativeROI

  }

}