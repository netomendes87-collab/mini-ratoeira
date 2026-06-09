'use client'

export default function PerformanceTables({
  ispStats,
  osStats,
  browserStats,
  dailyStats,
  tableStyle,
  td
}) {

  return (

    <>

      {/* ISP PERFORMANCE */}
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
          🌐 ISP Performance
        </h2>

        <table
          style={{
            width: '100%'
          }}
        >

          <thead>

            <tr>

              <th style={tableStyle}>
                ISP
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

            </tr>

          </thead>

          <tbody>

            {Object.entries(ispStats)
              .sort(
                (a, b) =>
                  b[1].revenue -
                  a[1].revenue
              )
              .map(([isp, data]) => (

                <tr key={isp}>

                  <td style={td}>
                    {isp}
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

                </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* OS PERFORMANCE */}
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
          🧠 OS Performance
        </h2>

        <table
          style={{
            width: '100%'
          }}
        >

          <thead>

            <tr>

              <th style={tableStyle}>
                OS
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

            </tr>

          </thead>

          <tbody>

            {Object.entries(osStats)
              .sort(
                (a, b) =>
                  b[1].revenue -
                  a[1].revenue
              )
              .map(([os, data]) => (

                <tr key={os}>

                  <td style={td}>
                    {os}
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

                </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* BROWSER PERFORMANCE */}
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
          🌐 Browser Performance
        </h2>

        <table
          style={{
            width: '100%'
          }}
        >

          <thead>

            <tr>

              <th style={tableStyle}>
                Browser
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

            </tr>

          </thead>

          <tbody>

            {Object.entries(browserStats)
              .sort(
                (a, b) =>
                  b[1].revenue -
                  a[1].revenue
              )
              .map(([browser, data]) => (

                <tr key={browser}>

                  <td style={td}>
                    {browser}
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

                </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PROFIT DIÁRIO */}
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
          📈 Profit Diário
        </h2>

        <table
          style={{
            width: '100%'
          }}
        >

          <thead>

            <tr>

              <th style={tableStyle}>
                Dia
              </th>

              <th style={tableStyle}>
                Revenue
              </th>

              <th style={tableStyle}>
                Spend
              </th>

              <th style={tableStyle}>
                Profit
              </th>

              <th style={tableStyle}>
                ROI
              </th>

            </tr>

          </thead>

          <tbody>

            {Object.entries(dailyStats)
              .sort()
              .map(([day, data]) => {

                const profit =
                  data.revenue - data.spend

                const roi =
                  data.spend > 0
                    ? (
                        (
                          profit /
                          data.spend
                        ) * 100
                      ).toFixed(1)
                    : 0

                return (

                  <tr key={day}>

                    <td style={td}>
                      {day}
                    </td>

                    <td style={td}>
                      ${data.revenue}
                    </td>

                    <td style={td}>
                      ${data.spend}
                    </td>

                    <td
                      style={{
                        ...td,
                        color:
                          profit >= 0
                            ? '#4ade80'
                            : '#ff4d4f'
                      }}
                    >
                      ${profit}
                    </td>

                    <td
                      style={{
                        ...td,
                        color:
                          roi >= 0
                            ? '#4ade80'
                            : '#ff4d4f'
                      }}
                    >
                      {roi}%
                    </td>

                  </tr>

                )

            })}

          </tbody>

        </table>

      </div>

    </>

  )

}