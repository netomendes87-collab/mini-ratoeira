'use client'

export default function ClickDetailsModal({

  selectedClick,
  setSelectedClick,
  handleBlockIP

}) {

  if (!selectedClick) return null

  return (

    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}
    >

      <div
        style={{
          background: '#14213d',
          padding: '30px',
          borderRadius: '20px',
          width: '700px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >

        <h2
          style={{
            marginBottom: '20px'
          }}
        >
          🔎 Detalhes do Click
        </h2>

        <div style={{ marginBottom: '10px' }}>
          <strong>ID:</strong> {selectedClick.id}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Campanha:</strong> {selectedClick.campanha}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>IP:</strong> {selectedClick.ip}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>País:</strong> {selectedClick.pais}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>ISP:</strong> {selectedClick.isp}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Dispositivo:</strong> {selectedClick.dispositivo}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>OS:</strong> {selectedClick.os}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Navegador:</strong> {selectedClick.navegador}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Keyword:</strong> {selectedClick.utm_term}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Fonte:</strong> {selectedClick.traffic_source}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Oferta:</strong> {selectedClick.offer}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>VPN:</strong> {selectedClick.is_vpn ? 'SIM' : 'NÃO'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>BOT:</strong> {selectedClick.is_bot ? 'SIM' : 'NÃO'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Proxy:</strong> {selectedClick.is_proxy ? 'SIM' : 'NÃO'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Datacenter:</strong> {selectedClick.is_datacenter ? 'SIM' : 'NÃO'}
        </div>

        <div
          style={{
            marginTop: '25px',
            background: '#0f172a',
            padding: '20px',
            borderRadius: '15px'
          }}
        >

          <h3
            style={{
              marginBottom: '15px'
            }}
          >
            🧠 AI Traffic Score
          </h3>

          <div
            style={{
              fontSize: '50px',
              fontWeight: 'bold',
              color:
                selectedClick.is_bot
                  ? '#ff4d4f'
                  : selectedClick.is_vpn
                  ? '#facc15'
                  : '#4ade80'
            }}
          >

            {
              selectedClick.is_bot
                ? '20'
                : selectedClick.is_vpn
                ? '65'
                : '95'
            }

          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '18px'
            }}
          >

            {
              selectedClick.is_bot
                ? '🔴 Alto Risco'
                : selectedClick.is_vpn
                ? '🟡 Atenção'
                : '🟢 Tráfego Limpo'
            }

          </div>

        </div>

        <button
          onClick={() => {

            handleBlockIP(
              selectedClick.ip
            )

          }}
          style={{
            marginTop: '20px',
            marginRight: '10px',
            background: '#dc2626',
            border: 'none',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          🚫 Bloquear IP
        </button>

        <button
          onClick={() =>
            setSelectedClick(null)
          }
          style={{
            background: '#334155',
            border: 'none',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginLeft: '10px'
          }}
        >
          ❌ Fechar
        </button>

      </div>

    </div>

  )

}