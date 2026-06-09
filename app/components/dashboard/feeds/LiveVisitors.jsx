'use client'

export default function LiveVisitors({
  visitors
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
        👥 Live Visitors
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '12px'
        }}
      >

        {visitors?.map((visitor, index) => (

          <div
            key={index}
            style={{
              background:
                'linear-gradient(135deg,#0f172a,#111c44)',
              padding: '16px',
              borderRadius: '12px',
              border:
                '1px solid #1e293b'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <strong>
                {visitor.country || 'Unknown'}
              </strong>

              <span
                style={{
                  color: '#4ade80'
                }}
              >
                {visitor.device || 'Desktop'}
              </span>
            </div>

            <div
              style={{
                fontSize: '14px',
                color: '#94a3b8'
              }}
            >
              IP: {visitor.ip}
            </div>

            <div
              style={{
                fontSize: '14px',
                color: '#94a3b8'
              }}
            >
              Browser: {visitor.browser}
            </div>

            <div
              style={{
                fontSize: '14px',
                color: '#94a3b8'
              }}
            >
              OS: {visitor.os}
            </div>

          </div>

        ))}

      </div>
    </div>
  )
}