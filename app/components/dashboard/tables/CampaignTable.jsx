'use client'

export default function CampaignTable({
  campaigns
}) {
  return (
    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '30px',
        overflowX: 'auto'
      }}
    >
      <h2
        style={{
          marginBottom: '20px'
        }}
      >
        📊 Campaign Performance
      </h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              color: '#8ea0ff',
              textAlign: 'left'
            }}
          >
            <th style={{ padding: '14px' }}>
              Campaign
            </th>

            <th style={{ padding: '14px' }}>
              Clicks
            </th>

            <th style={{ padding: '14px' }}>
              Conversions
            </th>

            <th style={{ padding: '14px' }}>
              Revenue
            </th>

            <th style={{ padding: '14px' }}>
              Spend
            </th>

            <th style={{ padding: '14px' }}>
              Profit
            </th>

            <th style={{ padding: '14px' }}>
              ROI
            </th>
          </tr>
        </thead>

        <tbody>

          {campaigns?.map((campaign, index) => (

            <tr
              key={index}
              style={{
                borderTop:
                  '1px solid #1e293b'
              }}
            >
              <td style={{ padding: '14px' }}>
                {campaign.name}
              </td>

              <td style={{ padding: '14px' }}>
                {campaign.clicks}
              </td>

              <td style={{ padding: '14px' }}>
                {campaign.conversions}
              </td>

              <td style={{ padding: '14px' }}>
                ${campaign.revenue}
              </td>

              <td style={{ padding: '14px' }}>
                ${campaign.spend}
              </td>

              <td
                style={{
                  padding: '14px',
                  color:
                    campaign.profit >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                ${campaign.profit}
              </td>

              <td
                style={{
                  padding: '14px',
                  color:
                    Number(campaign.roi) >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                {campaign.roi}%
              </td>

            </tr>

          ))}

        </tbody>
      </table>
    </div>
  )
}