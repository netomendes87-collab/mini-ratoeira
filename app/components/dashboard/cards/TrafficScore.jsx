export default function TrafficScore({
  trafficScore,
  trafficQuality
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
      <h3
        style={{
          color: 'white',
          marginBottom: '10px'
        }}
      >
        🧠 Traffic Score
      </h3>

      <div
        style={{
          color: '#4ade80',
          fontSize: '42px',
          fontWeight: 'bold'
        }}
      >
        {trafficScore}
      </div>

      <div
        style={{
          marginTop: '15px',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
      >
        🎯 Qualidade do Tráfego:{' '}
        {trafficQuality}
      </div>
    </div>
  )
}