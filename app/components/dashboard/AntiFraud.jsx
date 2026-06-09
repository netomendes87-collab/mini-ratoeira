'use client'

export default function AntiFraud({
  botClicks,
  vpnClicks,
  proxyClicks,
  datacenterClicks,
  cleanClicks
}) {

  return (

    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px'
      }}
    >

      <div>
        <h3>🤖 Bots</h3>

        <h2
          style={{
            color: '#ff4d4d'
          }}
        >
          {botClicks}
        </h2>
      </div>

      <div>
        <h3>🛡 VPN</h3>

        <h2
          style={{
            color: '#ffd600'
          }}
        >
          {vpnClicks}
        </h2>
      </div>

      <div>
        <h3>🌐 Proxy</h3>

        <h2
          style={{
            color: '#ff9900'
          }}
        >
          {proxyClicks}
        </h2>
      </div>

      <div>
        <h3>🏢 Datacenter</h3>

        <h2
          style={{
            color: '#9b59ff'
          }}
        >
          {datacenterClicks}
        </h2>
      </div>

      <div>
        <h3>✅ Clicks Limpos</h3>

        <h2
          style={{
            color: '#4ade80'
          }}
        >
          {cleanClicks}
        </h2>
      </div>

    </div>

  )
}