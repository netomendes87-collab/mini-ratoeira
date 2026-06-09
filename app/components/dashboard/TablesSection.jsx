export default function TablesSection({
  hourStats,
  deviceStats,
  ispStats,
  osStats,
  browserStats,
  dailyStats,
  tableStyle,
  td
}) {

  return (
    <>

      {/* HORÁRIOS LUCRATIVOS */}
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
          ⏰ Horários Lucrativos
        </h2>

        <table
          style={{
            width: '100%'
          }}
        >
          <thead>
            <tr>
              <th style={tableStyle}>Hora</th>
              <th style={tableStyle}>Clicks</th>
              <th style={tableStyle}>Conv</th>
              <th style={tableStyle}>Revenue</th>
              <th style={tableStyle}>CR%</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(hourStats)
              .sort(
                (a, b) =>
                  b[1].revenue -
                  a[1].revenue
              )
              .map(([hour, data]) => (
                <tr key={hour}>
                  <td style={td}>{hour}</td>
                  <td style={td}>{data.clicks}</td>
                  <td style={td}>{data.conversions}</td>
                  <td style={td}>${data.revenue}</td>

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

      {/* DEVICE PERFORMANCE */}
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
          🖥️ Device Performance
        </h2>

        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={tableStyle}>Device</th>
              <th style={tableStyle}>Clicks</th>
              <th style={tableStyle}>Conv</th>
              <th style={tableStyle}>Revenue</th>
              <th style={tableStyle}>CR%</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(deviceStats)
              .map(([device, data]) => (
                <tr key={device}>
                  <td style={td}>{device}</td>
                  <td style={td}>{data.clicks}</td>
                  <td style={td}>{data.conversions}</td>
                  <td style={td}>${data.revenue}</td>

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

    </>
  )
}