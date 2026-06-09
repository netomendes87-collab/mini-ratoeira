'use client'

export default function ActivityFeed({
  activities
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
        📡 Activity Feed
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        {activities?.map((activity, index) => (
          
          <div
            key={index}
            style={{
              background: '#0f172a',
              padding: '15px',
              borderRadius: '12px',
              border: '1px solid #1e293b'
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#cbd5e1'
              }}
            >
              {activity.message}
            </div>

            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#64748b'
              }}
            >
              {activity.time}
            </div>
          </div>

        ))}
      </div>
    </div>
  )
}