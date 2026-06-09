'use client'

export default function Alerts({
  alerts
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
        🚨 Alertas Automáticos
      </h2>

      {
        !alerts ||
        alerts.length === 0

          ? (

            <p
              style={{
                color: '#4ade80'
              }}
            >
              Nenhum alerta encontrado
            </p>

          )

          : (

            alerts.map((alert, i) => (

              <div
                key={i}
                style={{
                  padding: '12px',
                  borderBottom:
                    '1px solid #1f2d52'
                }}
              >

                <strong>
                  {alert.type}
                </strong>

                {' '}

                {alert.message}

              </div>

            ))

          )
      }

    </div>

  )
}