export function calculateMetrics({
  filteredClicks,
  filteredConversions,
  campaigns,
  selectedCampaign
}) {

  const totalConversions =
    filteredConversions.length

  const totalRevenue =
    filteredConversions.reduce(
      (acc, conv) =>
        acc +
        Number(
          conv.payout ||
          conv.commission ||
          0
        ),
      0
    )

  const filteredCampaigns =
    selectedCampaign === 'all'

      ? campaigns

      : campaigns.filter(
          (campaign) =>
            campaign.name?.toLowerCase() ===
            selectedCampaign?.toLowerCase()
        )

  const totalSpend =
    filteredCampaigns.reduce(
      (sum, campaign) =>
        sum +
        Number(campaign.spend || 0),
      0
    )

  const totalClicks =
    filteredClicks.length

  const epc =
    totalClicks > 0

      ? (
          totalRevenue /
          totalClicks
        ).toFixed(2)

      : '0.00'

  const conversionRate =
    totalClicks > 0

      ? (
          (
            totalConversions /
            totalClicks
          ) * 100
        ).toFixed(2)

      : 0

  const profit =
    totalRevenue -
    totalSpend

  const roi =
    totalSpend > 0

      ? (
          (
            profit /
            totalSpend
          ) * 100
        ).toFixed(2)

      : '0.00'

  return {

    totalConversions,

    totalRevenue,

    totalSpend,

    totalClicks,

    epc,

    conversionRate,

    profit,

    roi

  }

}