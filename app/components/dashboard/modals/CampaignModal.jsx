'use client'

export default function CampaignModal({
  showCampaignModal,
  setShowCampaignModal,
  newCampaignName,
  setNewCampaignName,
  newCampaignOffer,
  setNewCampaignOffer,
  newCampaignSpend,
  setNewCampaignSpend,
  handleCreateCampaign,
  editingCampaignId
}) {

  if (!showCampaignModal) return null

  return (

    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >

      <div
        style={{
          background: '#14213d',
          padding: '30px',
          borderRadius: '20px',
          width: '400px'
        }}
      >

        <h2>
          {editingCampaignId
            ? 'Editar Campanha'
            : 'Nova Campanha'}
        </h2>

        <input
          value={newCampaignName}
          onChange={(e) =>
            setNewCampaignName(e.target.value)
          }
          placeholder="Nome da campanha"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: 'none',
            background: 'white',
            color: 'black',
          }}
        />

        <input
          value={newCampaignOffer}
          onChange={(e) =>
            setNewCampaignOffer(e.target.value)
          }
          placeholder="Oferta"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: 'none',
            background: 'white',
            color: 'black',
          }}
        />

        <input
          value={newCampaignSpend}
          onChange={(e) =>
            setNewCampaignSpend(e.target.value)
          }
          placeholder="Spend"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none',
            background: 'white',
            color: 'black',
          }}
        />

        <button
          onClick={handleCreateCampaign}
          style={{
            background: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {editingCampaignId
            ? 'Salvar alterações'
            : 'Criar campanha'}
        </button>

        <button
          onClick={() =>
            setShowCampaignModal(false)
          }
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Fechar
        </button>

      </div>

    </div>

  )

}