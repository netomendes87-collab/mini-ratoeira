'use client'

export default function TopKeywords({
  keywordStats
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
        🔍 Top Keywords
      </h2>

      <table
        style={{
          width: '100%'
        }}
      >

        <thead>

          <tr>

            <th style={tableStyle}>
              Keyword
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
              CR%
            </th>

            <th style={tableStyle}>
              EPC
            </th>

          </tr>

        </thead>

        <tbody>

          {Object.entries(
            keywordStats || {}
          )
            .sort(
              (a, b) =>
                b[1].revenue -
                a[1].revenue
            )
            .slice(0, 10)
            .map(([keyword, data]) => (

              <tr key={keyword}>

                <td style={td}>
                  {keyword}
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