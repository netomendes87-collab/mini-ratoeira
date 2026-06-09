'use client'

export default function CampaignManager({
  campaigns,
  setEditingCampaignId,
  setNewCampaignName,
  setNewCampaignOffer,
  setNewCampaignSpend,
  setShowCampaignModal,
  handleDeleteCampaign
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
        📁 Gerenciar Campanhas
      </h2>

      {(campaigns || []).map((campaign) => (
        <div
          key={campaign.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #1f2d52'
          }}
        >
          <div>

            <h3>
              {campaign.name}
            </h3>

            <p
              style={{
                color: '#8ea2ff'
              }}
            >
              Oferta: {campaign.offer}
            </p>

            <p
              style={{
                color: '#4ade80'
              }}
            >
              Spend: ${campaign.spend || 0}
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >

            <button
              onClick={() => {

                setEditingCampaignId(
                  campaign.id
                )

                setNewCampaignName(
                  campaign.name || ''
                )

                setNewCampaignOffer(
                  campaign.offer || ''
                )

                setNewCampaignSpend(
                  campaign.spend || ''
                )

                setShowCampaignModal(true)

              }}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              ✏️ Editar
            </button>

            <button
              onClick={() =>
                handleDeleteCampaign(
                  campaign.id
                )
              }
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              🗑️ Excluir
            </button>

          </div>

        </div>
      ))}

    </div>

  )

}