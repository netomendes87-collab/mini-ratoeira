'use client'

export default function AITrafficScore({
  aiCampaignScore
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
        🤖 AI Traffic Score
      </h2>

      <table
        style={{
          width: '100%'
        }}
      >

        <thead>

          <tr>

            <th style={tableStyle}>
              Campanha
            </th>

            <th style={tableStyle}>
              ROI
            </th>

            <th style={tableStyle}>
              Profit
            </th>

            <th style={tableStyle}>
              Status IA
            </th>

          </tr>

        </thead>

        <tbody>

          {Object.entries(
            aiCampaignScore || {}
          ).map(([campaign, data]) => (

            <tr key={campaign}>

              <td style={td}>
                {campaign}
              </td>

              <td
                style={{
                  ...td,
                  color:
                    data.roi >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                {Number(data.roi).toFixed(1)}%
              </td>

              <td
                style={{
                  ...td,
                  color:
                    data.profit >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                ${data.profit}
              </td>

              <td style={td}>
                {data.status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

const tableStyle = {
  padding: '14px',
  textAlign: 'left',
  color: '#8ea2ff',
  borderBottom: '1px solid #1f2d52',
}

const td = {
  padding: '14px 0',
  borderBottom: '1px solid #1f2d52',
}