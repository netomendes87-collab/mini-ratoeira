export function buildBlacklistIPs(
  suspiciousClicks
) {

  return suspiciousClicks.map(
    (click) => ({

      ip: click.ip,

      country:
        click.pais ||
        'Desconhecido',

      isp:
        click.isp ||
        'Desconhecido',

      reason:
        click.is_bot
          ? 'Bot'

          : click.is_vpn
          ? 'VPN'

          : click.is_proxy
          ? 'Proxy'

          : click.is_datacenter
          ? 'Datacenter'

          : 'Suspeito'

    })
  )

}