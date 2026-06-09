export default function DeadCampaigns({
  deadCampaigns,
  tableStyle,
  td
}) {

  if (deadCampaigns.length === 0) {
    return null
  }

  return (

    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px'
      }}
    >

      <h3
        style={{
          color: '#ff4d4d'
        }}
      >
        🚨 Campanhas Mortas
      </h3>

      <table
        style={{
          width: '100%',
          marginTop: '15px'
        }}
      >

        <thead>

          <tr>

            <th style={tableStyle}>
              Campanha
            </th>

            <th style={tableStyle}>
              Spend
            </th>

            <th style={tableStyle}>
              Conversões
            </th>

            <th style={tableStyle}>
              Prejuízo
            </th>

          </tr>

        </thead>

        <tbody>

          {deadCampaigns.map(
            ([name, data]) => (

              <tr key={name}>

                <td style={td}>
                  {name}
                </td>

                <td style={td}>
                  ${data.spend}
                </td>

                <td style={td}>
                  {data.conversions}
                </td>

                <td
                  style={{
                    ...td,
                    color: '#ff4d4d'
                  }}
                >
                  ${data.spend}
                </td>

              </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}