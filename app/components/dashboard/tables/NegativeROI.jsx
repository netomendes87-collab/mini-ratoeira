export default function NegativeROI({
  negativeROI,
  tableStyle,
  td
}) {

  if (negativeROI.length === 0) {
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
          color: '#ff9900'
        }}
      >
        ⚠️ ROI Negativo
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
              ROI
            </th>

            <th style={tableStyle}>
              Revenue
            </th>

            <th style={tableStyle}>
              Spend
            </th>

          </tr>

        </thead>

        <tbody>

          {negativeROI.map(
            ([name, data]) => {

              const roi =
                (
                  (
                    (data.revenue - data.spend) /
                    data.spend
                  ) * 100
                ).toFixed(1)

              return (

                <tr key={name}>

                  <td style={td}>
                    {name}
                  </td>

                  <td
                    style={{
                      ...td,
                      color: '#ff9900'
                    }}
                  >
                    {roi}%
                  </td>

                  <td style={td}>
                    ${data.revenue}
                  </td>

                  <td style={td}>
                    ${data.spend}
                  </td>

                </tr>

              )

            }
          )}

        </tbody>

      </table>

    </div>

  )
}