export default function SuspiciousTraffic({
  suspiciousClicks,
  tableStyle,
  td
}) {

  return (
    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '30px'
      }}
    >
      <h2
        style={{
          marginBottom: '20px'
        }}
      >
        🚨 Tráfego Suspeito
      </h2>

      {suspiciousClicks.length === 0 ? (

        <p
          style={{
            color: '#4ade80'
          }}
        >
          Nenhum clique suspeito encontrado
        </p>

      ) : (

        <table
          style={{
            width: '100%'
          }}
        >
          <thead>
            <tr>
              <th style={tableStyle}>IP</th>
              <th style={tableStyle}>País</th>
              <th style={tableStyle}>ISP</th>
              <th style={tableStyle}>Motivo</th>
            </tr>
          </thead>

          <tbody>

            {suspiciousClicks.map((click) => (

              <tr key={click.id}>

                <td style={td}>
                  {click.ip}
                </td>

                <td style={td}>
                  {click.pais}
                </td>

                <td style={td}>
                  {click.isp}
                </td>

                <td style={td}>
                  {click.is_bot
                    ? 'Bot'
                    : click.is_vpn
                    ? 'VPN'
                    : click.is_proxy
                    ? 'Proxy'
                    : click.is_datacenter
                    ? 'Datacenter'
                    : '-'}
                </td>

              </tr>

            ))}

          </tbody>
        </table>

      )}

    </div>
  )
}