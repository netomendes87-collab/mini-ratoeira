export function buildFraudStats(
  botClicks,
  vpnClicks,
  proxyClicks,
  datacenterClicks,
  cleanClicks
) {

  return {

    bots: botClicks,

    vpn: vpnClicks,

    proxy: proxyClicks,

    datacenter: datacenterClicks,

    clean: cleanClicks

  }

}

export function buildTrafficQualityStats(
  cleanClicks,
  botClicks,
  vpnClicks,
  proxyClicks,
  datacenterClicks
) {

  return [

    {
      type: 'Clean',
      total: cleanClicks
    },

    {
      type: 'Bot',
      total: botClicks
    },

    {
      type: 'VPN',
      total: vpnClicks
    },

    {
      type: 'Proxy',
      total: proxyClicks
    },

    {
      type: 'Datacenter',
      total: datacenterClicks
    }

  ]

}