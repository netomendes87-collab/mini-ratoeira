'use client'

export default function RecentConversions({
  filteredConversions,
  td
}) {

  return (

    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        overflowX: 'auto'
      }}
    >

      <h2 style={{ marginBottom: '20px' }}>
        💰 Últimas Conversões
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
              Click ID
            </th>

            <th align="left">
              FBCLID
            </th>

            <th align="left">
              Payout
            </th>

          </tr>

        </thead>

        <tbody>

          {(filteredConversions || [])
            .slice(0, 20)
            .map(conv => (

              <tr key={conv.id}>

                <td style={td}>
                  {conv.click_id}
                </td>

                <td style={td}>
                  {conv.fbclid}
                </td>

                <td style={td}>
                  ${conv.payout}
                </td>

              </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}