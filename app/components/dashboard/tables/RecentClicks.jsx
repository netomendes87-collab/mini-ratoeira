'use client'

export default function RecentClicks({
  filteredClicks,
  setSelectedClick,
  td
}) {

  return (

    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        overflowX: 'auto',
      }}
    >

      <h2 style={{ marginBottom: '20px' }}>
        📊 Últimos Clicks
      </h2>

      <table
        width="100%"
        style={{
          borderCollapse: 'collapse'
        }}
      >

        <thead>

          <tr style={{ color: '#8ea0ff' }}>

            <th align="left">
              ID
            </th>

            <th align="left">
              Campanha
            </th>

            <th align="left">
              Dispositivo
            </th>

            <th align="left">
              IP
            </th>

            <th align="left">
              Ações
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredClicks
            .slice(0, 20)
            .map(click => (

              <tr key={click.id}>

                <td style={td}>
                  {click.id}
                </td>

                <td style={td}>
                  {click.campanha}
                </td>

                <td style={td}>
                  {click.dispositivo}
                </td>

                <td style={td}>
                  {click.ip}
                </td>

                <td style={td}>

                  <button
                    onClick={() =>
                      setSelectedClick(click)
                    }
                    style={{
                      background: '#2563eb',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Ver
                  </button>

                </td>

              </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}