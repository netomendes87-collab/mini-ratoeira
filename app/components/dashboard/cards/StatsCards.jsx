export default function StatsCards({

  totalClicks,
  uniqueCampaigns,
  desktopClicks,
  mobileClicks,
  totalConversions,
  totalRevenue,
  conversionRate,
  epc,
  totalSpend,
  profit,
  roi

}) {

  const cardStyle = {
    background: '#14213d',
    padding: '25px',
    borderRadius: '20px',
  }

  return (

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}
    >

      <div style={cardStyle}>
        <h3>Total Clicks</h3>
        <h1>{totalClicks}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Campanhas</h3>
        <h1>{uniqueCampaigns.length}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Desktop</h3>
        <h1>{desktopClicks}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Mobile</h3>
        <h1>{mobileClicks}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Conversões</h3>
        <h1>{totalConversions}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Revenue</h3>
        <h1>
          ${Number(totalRevenue || 0).toFixed(2)}
        </h1>
      </div>

      <div style={cardStyle}>
        <h3>CR%</h3>
        <h1>{conversionRate}%</h1>
      </div>

      <div style={cardStyle}>
        <h3>EPC</h3>
        <h1>${epc}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Spend</h3>
        <h1>
          ${Number(totalSpend).toFixed(2)}
        </h1>
      </div>

      <div style={cardStyle}>
        <h3>Profit</h3>
        <h1>
          ${Number(profit).toFixed(2)}
        </h1>
      </div>

      <div style={cardStyle}>
        <h3>ROI</h3>
        <h1>{roi}%</h1>
      </div>

    </div>

  )

}