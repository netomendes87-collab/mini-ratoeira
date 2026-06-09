'use client'

export default function OfferPerformance({
  offerPerformanceAI
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
        🎯 Offer Performance AI
      </h2>

      <table
        style={{
          width: '100%'
        }}
      >

        <thead>

          <tr>

            <th style={tableStyle}>
              Oferta
            </th>

            <th style={tableStyle}>
              Clicks
            </th>

            <th style={tableStyle}>
              Conv
            </th>

            <th style={tableStyle}>
              Revenue
            </th>

            <th style={tableStyle}>
              EPC
            </th>

            <th style={tableStyle}>
              CR%
            </th>

          </tr>

        </thead>

        <tbody>

          {Object.entries(
            offerPerformanceAI || {}
          ).map(([offer, data]) => (

            <tr key={offer}>

              <td style={td}>
                {offer}
              </td>

              <td style={td}>
                {data.clicks}
              </td>

              <td style={td}>
                {data.conversions}
              </td>

              <td style={td}>
                ${data.revenue}
              </td>

              <td style={td}>

                $
                {
                  data.clicks > 0
                    ? (
                        data.revenue /
                        data.clicks
                      ).toFixed(2)
                    : 0
                }

              </td>

              <td style={td}>

                {
                  data.clicks > 0
                    ? (
                        (
                          data.conversions /
                          data.clicks
                        ) * 100
                      ).toFixed(1)
                    : 0
                }%

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