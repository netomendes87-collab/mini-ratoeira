export function buildDeviceStats(
  filteredClicks
) {

  const desktopClicks =
    filteredClicks.filter(
      (click) =>
        click.dispositivo === 'desktop'
    ).length

  const mobileClicks =
    filteredClicks.filter(
      (click) =>
        click.dispositivo === 'mobile'
    ).length

  return {
    desktopClicks,
    mobileClicks
  }

}

export function buildUniqueCampaigns(
  filteredClicks
) {

  return [
    ...new Set(
      (filteredClicks || []).map(
        (click) =>
          click.campanha || 'unknown'
      )
    ),
  ]

}