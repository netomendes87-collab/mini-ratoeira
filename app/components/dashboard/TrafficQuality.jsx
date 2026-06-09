'use client'

export default function TrafficQuality({
  trafficQualityStats
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
        🧠 Traffic Quality
      </h2>

      <table
        style={{
          width: '100%'
        }}
      >

        <thead>

          <tr>

            <th style={tableStyle}>
              Tipo
            </th>

            <th style={tableStyle}>
              Quantidade
            </th>

          </tr>

        </thead>

        <tbody>

          {trafficQualityStats.map(
            (item, i) => (

              <tr key={i}>

                <td style={td}>
                  {item.type}
                </td>

                <td style={td}>
                  {item.total}
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