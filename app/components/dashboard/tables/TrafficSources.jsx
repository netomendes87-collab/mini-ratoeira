export default function TrafficSources({
  trafficSources,
  tableStyle,
  td
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
        📊 Fontes de Tráfego
      </h2>

      <table
        style={{
          width: '100%'
        }}
      >
        <thead>
          <tr>
            <th style={tableStyle}>
              Fonte
            </th>

            <th style={tableStyle}>
              Clicks
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(trafficSources).map(
            ([source, total]) => (
              <tr key={source}>
                <td style={td}>
                  {source}
                </td>

                <td style={td}>
                  {total}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}