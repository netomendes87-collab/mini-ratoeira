export default function AutoBlacklist({
  blacklistIPs,
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
        🚫 Auto Blacklist
      </h2>

      {
        blacklistIPs.length === 0
          ? (
              <p
                style={{
                  color: '#4ade80'
                }}
              >
                Nenhum IP suspeito
              </p>
            )
          : (
              <table
                style={{
                  width: '100%'
                }}
              >
                <thead>
                  <tr>
                    <th style={tableStyle}>
                      IP
                    </th>

                    <th style={tableStyle}>
                      País
                    </th>

                    <th style={tableStyle}>
                      ISP
                    </th>

                    <th style={tableStyle}>
                      Motivo
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {blacklistIPs.map(
                    (item, i) => (

                      <tr key={i}>

                        <td style={td}>
                          {item.ip}
                        </td>

                        <td style={td}>
                          {item.country}
                        </td>

                        <td style={td}>
                          {item.isp}
                        </td>

                        <td
                          style={{
                            ...td,
                            color: '#ff4d4f'
                          }}
                        >
                          {item.reason}
                        </td>

                      </tr>

                  ))}

                </tbody>
              </table>
            )
      }

    </div>
  )
}