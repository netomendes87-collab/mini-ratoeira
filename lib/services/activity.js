export function buildActivityFeed(
  filteredClicks,
  filteredConversions
) {

  const feed = []

  filteredClicks
    .slice(0, 6)
    .forEach((click) => {

      feed.push({

        type:
          click.is_vpn
            ? 'vpn'
            : click.is_bot
            ? 'bot'
            : 'click',

        message:

          click.is_vpn

            ? `🚨 VPN detectada — ${click.pais}`

            : click.is_bot

            ? `🤖 Bot detectado — ${click.pais}`

            : `🟢 Novo visitante — ${click.pais}`

      })

    })

  filteredConversions
    .slice(0, 4)
    .forEach((conv) => {

      feed.push({

        type: 'conversion',

        message:
          `💰 Conversão recebida — $${conv.payout}`

      })

    })

  return feed.slice(0, 10)

}