'use client'

import {
  useEffect,
  useState,
  useMemo
} from 'react'

import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function Dashboard() {

  const router = useRouter()

useEffect(() => {
  checkUser()
}, [])

async function checkUser() {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    router.push('/login')
  }
}

async function handleLogout() {
  await supabase.auth.signOut()

  router.push('/login')
}

  const [clicks, setClicks] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [conversions, setConversions] = useState([])

  const [showCampaignModal, setShowCampaignModal] = useState(false)

  const [newCampaignName, setNewCampaignName] = useState('')
  const [newCampaignOffer, setNewCampaignOffer] = useState('')
  const [newCampaignSpend, setNewCampaignSpend] = useState('')

  const [editingCampaign, setEditingCampaign] = useState(null)

  const [editName, setEditName] = useState('')
  const [editOffer, setEditOffer] = useState('')
  const [editSpend, setEditSpend] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {

  loadData()

  const channel = supabase

    .channel('dashboard-realtime')

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'clicks'
      },
      () => {
        loadData()
      }
    )

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversions'
      },
      () => {
        loadData()
      }
    )

    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }

}, [])

  
  async function loadData() {

    try {

      // CLICKS
      const {
        data: clicksData,
        error: clicksError
      } = await supabase
        .from('clicks')
        .select('*')
        .order('id', { ascending: false })

      if (clicksError) {
       console.error(clicksError)

    }

      setClicks(clicksData || [])

      
      
      

      // CONVERSIONS
      const {
        data: conversionsData,
        error: conversionsError
      } = await supabase
        .from('conversions')
        .select('*')
        .order('id', { ascending: false })

      if (conversionsError) {
        console.error(conversionsError)
  }

      
      setConversions(conversionsData || [])

      
     
      

      
      

      // CAMPAIGNS
      const {
        data: campaignsData,
        error: campaignsError
      } = await supabase
        .from('campaigns')
        .select('*')

      if (campaignsError) {
       console.error(campaignsError)
  }

      
      setCampaigns(campaignsData || [])

      setLoading(false)

      

    } catch (err) {

  console.error(err)

  setLoading(false)

}

  }

  // MÉTRICAS

  const isWithinPeriod = (date) => {

  if (selectedPeriod === 'all') return true

  const now = new Date()
  const itemDate = new Date(date)

  const diffTime = now - itemDate
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (selectedPeriod === 'today') {
    return diffDays < 1
  }

  if (selectedPeriod === '7days') {
    return diffDays <= 7
  }

  if (selectedPeriod === '30days') {
    return diffDays <= 30
  }

  return true
}
  const filteredClicks = clicks.filter((click) => {

  const matchCampaign =
    selectedCampaign === 'all' ||
    click.campanha === selectedCampaign

  const matchPeriod =
    isWithinPeriod(
      click.created_at || click.date
    )

  return matchCampaign && matchPeriod

})



// MÉTRICAS

const filteredConversions = conversions.filter(conv => {

  const matchCampaign =
    selectedCampaign === 'all' ||
    conv.campanha === selectedCampaign

  const matchPeriod =
    isWithinPeriod(
      conv.created_at ||
      conv.date
    )

  return matchCampaign && matchPeriod

})

const totalConversions = useMemo(() => {
  return filteredConversions.length
}, [filteredConversions])

const totalRevenue = useMemo(() => {

  return (filteredConversions || []).reduce(
    (acc, conv) => {

      return acc + Number(
        conv.payout ||
        conv.commission ||
        0
      )

    },
    0
  )

}, [filteredConversions])


const totalSpend = useMemo(() => {
  const filteredCampaigns =
    selectedCampaign === 'all'
      ? campaigns
      : campaigns.filter(
          campaign =>
            campaign.name?.toLowerCase() ===
            selectedCampaign?.toLowerCase()
        )

  return (filteredCampaigns || []).reduce(
    (sum, campaign) =>
      sum + Number(campaign.spend || 0),
    0
  )
}, [campaigns, selectedCampaign])


const totalClicks = useMemo(() => {
  return filteredClicks.length
}, [filteredClicks])

const totalROI =
  totalRevenue - totalSpend

const epc =
  totalClicks > 0
    ? (
        Number(totalRevenue || 0) /
        Number(totalClicks || 0)
      ).toFixed(2)
    : '0.00'

const conversionRate =
  totalClicks > 0
    ? (
        (totalConversions / totalClicks) * 100
      ).toFixed(2)
    : 0

  const profit =
  Number(totalRevenue || 0) -
  Number(totalSpend || 0)

  const roi =
  totalSpend > 0
    ? ((profit / totalSpend) * 100).toFixed(2)
    : '0.00'

  const desktopClicks =
    (filteredClicks || []).filter(
      click => click.dispositivo === 'desktop'
    ).length

  const mobileClicks =
  (filteredClicks || []).filter(
    click => click.dispositivo === 'mobile'
  ).length

const uniqueCampaigns = [
  ...new Set(
    (filteredClicks || []).map(
      click => click.campanha || 'unknown'
    )
  )
]

  // PAÍSES
  const revenueChartData = []

 const keywordStats = {}
 const sourceStats = {}

 const countryStats = {}
 const geoStats = {}

;(filteredConversions || []).forEach(conv => {

const geo =
  conv.pais || 'Unknown'

if (!geoStats[geo]) {

  geoStats[geo] = {
    clicks: 0,
    revenue: 0
  }

}

  revenueChartData.push({
    date: new Date(
      conv.created_at
    ).toLocaleDateString(),

    revenue: Number(
      conv.payout || 0
    )
  })
})

;(filteredClicks || []).forEach(click => {

  const source =
  click.utm_source || 'Direct'

if (!sourceStats[source]) {

  sourceStats[source] = {
    clicks: 0,
    conversions: 0,
    revenue: 0,
    spend: 0
  }

}

sourceStats[source].clicks += 1

  const keyword =
    click.palavra_chave || 'unknown'

  if (!keywordStats[keyword]) {

    keywordStats[keyword] = {
      clicks: 0,
      conversions: 0,
      revenue: 0,
      spend: 0

    }
  }

  keywordStats[keyword].clicks += 1
  keywordStats[keyword].spend +=
  Number(click.spend || 0)
})

;(filteredConversions || []).forEach(conv => {

  const source =
  conv.utm_source || 'Direct'

  const geo =
  conv.pais || 'Unknown'

if (!sourceStats[source]) {

  sourceStats[source] = {
    clicks: 0,
    conversions: 0,
    revenue: 0,
    spend: 0
  }

}

  const keyword =
    conv.palavra_chave || 'unknown'

  if (!keywordStats[keyword]) {

    keywordStats[keyword] = {
      clicks: 0,
      conversions: 0,
      revenue: 0,
      spend: 0
    }
  }

  keywordStats[keyword].conversions += 1

  sourceStats[source].conversions += 1

  sourceStats[source].revenue +=
  Number(conv.payout || 0)

  keywordStats[keyword].revenue +=
  Number(conv.payout || 0)

  geoStats[geo].revenue +=
  Number(conv.payout || 0)

})

const topKeyword =
  Object.entries(keywordStats)
    .sort(
      (a, b) =>
        b[1].revenue - a[1].revenue
    )[0]


  ;(filteredClicks || []).forEach(click => {

    const country =
      click.pais || 'Desconhecido'

    const geo =
  click.pais || 'Unknown'

if (!geoStats[geo]) {

  geoStats[geo] = {
    clicks: 0,
    revenue: 0
  }

}

geoStats[geo].clicks += 1  

    countryStats[country] =
      (countryStats[country] || 0) + 1

  })

   // GRÁFICO



const groupedClicks = {}

;(filteredClicks || []).forEach(click => {

  const date =
    new Date(
      click.created_at || click.date
    )

  const label =
    `${date.getHours()}:00`

  groupedClicks[label] =
    (groupedClicks[label] || 0) + 1

})

const chartData =
  Object.entries(groupedClicks)
    .map(([hour, total]) => ({
      name: hour,
      clicks: total
    }))
    .sort((a, b) => {
      return parseInt(a.name) - parseInt(b.name)
    })
  
async function handleCreateCampaign() {

  if (editingCampaign) {

    const { error } = await supabase
      .from('campaigns')
      .update({
        name: editName,
        offer: editOffer,
        spend: Number(editSpend)
      })
      .eq('id', editingCampaign.id)

    if (error) {
      console.error(error)
      alert('Erro ao editar campanha')
      return
    }

    alert('Campanha atualizada!')

  } else {

    const { error } = await supabase
      .from('campaigns')
      .insert([
        {
          name: newCampaignName,
          offer: newCampaignOffer,
          spend: Number(newCampaignSpend)
        }
      ])

    if (error) {
      console.error(error)
      alert('Erro ao criar campanha')
      return
    }

    alert('Campanha criada com sucesso!')
  }

  setShowCampaignModal(false)

  setEditingCampaign(null)

  setNewCampaignName('')
  setNewCampaignOffer('')
  setNewCampaignSpend('')

  setEditName('')
  setEditOffer('')
  setEditSpend('')

  loadData()
}

if (loading) {
  return (
    <div
      style={{
        background: '#020c2b',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
        fontFamily: 'Arial'
      }}
    >
      carregando dashboard...
    </div>
  )
}

return (

<div
  style={{
    background: '#020c2b',
    minHeight: '100vh',
    padding: '40px',
    color: 'white',
    fontFamily: 'Arial'
  }}
 >
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  }}
>
  <h1
    style={{
      fontSize: '42px'
    }}
  >
    🚀 Mini Ratoeira
  </h1>

  <button
    onClick={handleLogout}
    style={{
      background: '#1e3a8a',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      cursor: 'pointer'
    }}
  >
    Sair
  </button>
</div>

<div style={{ marginBottom: '20px' }}>

  <select
    value={selectedCampaign}
    onChange={(e) =>
      setSelectedCampaign(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '10px',
      background: '#14213d',
      color: 'white',
      border: '1px solid #22345a'
    }}
  >
    <option value="all">
      Todas campanhas
    </option>

    {(campaigns || []).map((campaign) => (
      <option
        key={campaign.id}
        value={campaign.name}
      >
        {campaign.name}
      </option>
    ))}
  </select>

  <button
  onClick={() => setShowCampaignModal(true)}
  style={{
    padding: '12px 20px',
    borderRadius: '12px',
    background: '#22c55e',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '10px'
  }}
>
  + Nova Campanha
</button>

  <select
    value={selectedPeriod}
    onChange={(e) =>
      setSelectedPeriod(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '10px',
      background: '#14213d',
      color: 'white',
      border: '1px solid #22345a',
      marginLeft: '10px'
    }}
  >
    <option value="all">
      Tudo
    </option>

    <option value="today">
      Hoje
    </option>

    <option value="7days">
      7 dias
    </option>

    <option value="30days">
      30 dias
    </option>
  </select>

</div>

    {/* CARDS */}

    <div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  }}
>

  <div
    style={{
      background: '#14213d',
      padding: '20px',
      borderRadius: '20px'
    }}
  >
    <h3>💰 Revenue</h3>

    <h1>
      ${Number(totalRevenue).toFixed(2)}
    </h1>
  </div>

  <div
    style={{
      background: '#14213d',
      padding: '20px',
      borderRadius: '20px'
    }}
  >
    <h3>📈 ROI</h3>

    <h1
      style={{
        color:
          totalROI >= 0
            ? '#4ade80'
            : '#ef4444'
      }}
    >
      ${Number(totalROI).toFixed(2)}
    </h1>
  </div>

  <div
    style={{
      background: '#14213d',
      padding: '20px',
      borderRadius: '20px'
    }}
  >
    <h3>🎯 Conversões</h3>

    <h1>
      {totalConversions}
    </h1>
  </div>

  <div
    style={{
      background: '#14213d',
      padding: '20px',
      borderRadius: '20px'
    }}
  >
    <h3>⚡ EPC</h3>

    <h1>
      ${epc}
    </h1>
  </div>

</div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
         'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
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
        <h1>${Number(totalRevenue || 0).toFixed(2)}</h1>
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
        <h1>${Number(totalSpend).toFixed(2)}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Profit</h3>
        <h1>${Number(profit).toFixed(2)}</h1>
      </div>

      <div style={cardStyle}>
        <h3>ROI</h3>
        <h1>{roi}%</h1>
      </div>

    </div>

      {/* GRÁFICO */}

      <div
        style={{
          background: '#14213d',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px'
        }}
      >

        <h2 style={{ marginBottom: '20px' }}>
          📈 Clicks em Tempo Real
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart data={chartData}>

            <CartesianGrid
              stroke="#1f2d52"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              stroke="#8ea0ff"
            />

            <YAxis stroke="#8ea0ff" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#4ade80"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div
  style={{
    marginTop: '30px',
    background: '#14213d',
    padding: '20px',
    borderRadius: '20px',
    overflow: 'auto',
  }}
>
  <h2 style={{ marginBottom: '20px' }}>
    📊 Conversões Recentes
  </h2>

  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse'
    }}
  >
    <thead>
      <tr>
        <th style={tableStyle}>Click ID</th>
        <th style={tableStyle}>Produto</th>
        <th style={tableStyle}>Payout</th>
        <th style={tableStyle}>Data</th>
      </tr>
    </thead>

    <tbody>
      {filteredConversions.map((conv) => (
        <tr key={conv.id}>
          <td style={tableStyle}>{conv.click_id}</td>

          <td style={tableStyle}>
            {conv.product || '-'}
          </td>

          <td style={tableStyle}>
            ${conv.payout || 0}
          </td>

          <td style={tableStyle}>
          {
  conv.created_at
    ? new Date(
        new Date(conv.created_at)
          .getTime() - (3 * 60 * 60 * 1000)
      ).toLocaleString('pt-BR')
    : '-'
}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{topKeyword && (

  <div
    style={{
      background: '#16a34a',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '30px',
      color: 'white'
    }}
  >

    <h2>
      🏆 Top Winner
    </h2>

    <h1
      style={{
        marginTop: '10px',
        marginBottom: '10px'
      }}
    >
      {topKeyword[0]}
    </h1>

    <p>
      Revenue: $
      {topKeyword[1].revenue}
    </p>

    <p>
      ROI: $
      {topKeyword[1].revenue -
        topKeyword[1].spend}
    </p>

  </div>

)}

<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px',
    overflowX: 'auto',
  }}
>
  <h2 style={{ marginBottom: '20px' }}>
    📂 Campanhas
  </h2>

  <table
    width="100%"
    style={{
      borderCollapse: 'collapse'
    }}
  >
    <thead>
      <tr style={{ color: '#8ea0ff' }}>
        <th align="left">Nome</th>
        <th align="left">Offer</th>
        <th align="left">Spend</th>
        <th align="left">Revenue</th>
        <th align="left">ROI</th>
        <th align="left">Tracking</th>
        <th align="left">Ações</th>
      </tr>
    </thead>

    <tbody>

      {(campaigns || []).map(campaign => {

  const campaignRevenue =
    (filteredConversions || [])
      .filter(
        conv =>
          conv.campanha ===
          campaign.name
      )
      .reduce(
        (acc, conv) =>
          acc +
          Number(
            conv.payout || 0
          ),
        0
      )

  const campaignROI =
    campaignRevenue -
    Number(campaign.spend || 0)

  return (

        <tr key={campaign.id}>

          <td style={td}>
            {campaign.name}
          </td>

          <td style={td}>
            {campaign.offer}
          </td>

          <td style={td}>
            ${campaign.spend}
          </td>
          <td style={td}>
  ${campaignRevenue || 0}
</td>

<td
  style={{
    ...td,
    color:
      (
        campaignROI
      ) >= 0
        ? '#4ade80'
        : '#ef4444'
  }}
>
  ${campaignROI.toFixed(2)}
</td>
          <td style={td}>
  <span
    style={{
      color: '#4ade80',
      fontSize: '12px',
      wordBreak: 'break-all'
    }}
  >
    {window.location.origin}/click?campanha=
    {campaign.name}
    &offer=
    {campaign.offer}
  </span>
</td>

          <td style={td}>

            <button
  onClick={() => {

    setEditingCampaign(campaign)

    setEditName(campaign.name || '')
    setEditOffer(campaign.offer || '')
    setEditSpend(campaign.spend || '')

    setShowCampaignModal(true)

  }}

  style={{
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer'
  }}
>
  ✏️ Editar
</button>

<button
  onClick={async () => {

    const confirmDelete =
      confirm(
        `Deletar campanha ${campaign.name}?`
      )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaign.id)

    if (error) {
      console.error(error)
      alert('Erro ao deletar campanha')
      return
    }

    alert('Campanha deletada!')

    loadData()

  }}

  style={{
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginLeft: '10px'
  }}
>
  🗑️ Deletar
</button>
<button
  onClick={() => {

    const trackingLink =
      `${window.location.origin}/click?campanha=${campaign.name}&offer=${campaign.offer}`

    navigator.clipboard.writeText(
      trackingLink
    )

    alert('Link copiado!')

  }}

  style={{
    background: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginLeft: '10px'
  }}
>
  🔗 Copiar Link
</button>
          </td>

        </tr>

      )
})}

    </tbody>
  </table>
</div>
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px'
  }}
>

  <h2 style={{ marginBottom: '20px' }}>
    📈 Revenue Chart
  </h2>

  <div style={{ width: '100%', height: 300 }}>

    <ResponsiveContainer>

      <LineChart data={revenueChartData}>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f2d52"
        />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4ade80"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px'
  }}
>
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px'
  }}
>

  <h2 style={{ marginBottom: '20px' }}>
    📊 Top Sources
  </h2>

  {
    Object.entries(sourceStats)
      .sort(
        (a, b) =>
          b[1].revenue - a[1].revenue
      )
      .map(([source, data]) => {

        const roi =
          data.revenue - data.spend

        return (

          <div
            key={source}
            style={{
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom:
                '1px solid #22345f'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between'
              }}
            >

              <strong>
                {source}
              </strong>

              <span
                style={{
                  color:
                    roi >= 0
                      ? '#4ade80'
                      : '#ef4444'
                }}
              >
                ROI: $
                {roi.toFixed(2)}
              </span>

            </div>

            <div
              style={{
                marginTop: '8px',
                color: '#8ea0ff',
                fontSize: '14px'
              }}
            >

              {data.clicks} clicks •
              {' '}
              {data.conversions}
              {' '}
              conv • $
              {data.revenue.toFixed(2)}

            </div>

          </div>

        )

      })
  }

</div>
  <h2 style={{ marginBottom: '20px' }}>
    🔥 Keywords
  </h2>

  {Object.entries(keywordStats)
  .sort(
    (a, b) =>
      b[1].revenue - a[1].revenue
  )
  .map(
    ([keyword, data]) => (

      <div
        key={keyword}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid #1f2d52'
        }}
      >

        <span>{keyword}</span>

        <strong
  style={{
    color:
      (data.revenue - data.spend) >= 0
        ? '#4ade80'
        : '#ef4444'
  }}
>
  {data.clicks} clicks • {' '}
  {data.conversions} conv • {' '}
  ${data.revenue} • ROI: $
  {data.revenue - data.spend}
</strong>

      </div>

    )
  )}

</div>
      {/* PAÍSES */}

      <div
        style={{
          background: '#14213d',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px'
        }}
      >

        <h2 style={{ marginBottom: '20px' }}>
          🌍 Países
        </h2>

        {Object.entries(countryStats).map(
          ([country, total]) => (

            <div
              key={country}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #1f2d52'
              }}
            >

              <span>{country}</span>

              <strong>

  {geoStats[country]?.clicks || 0}
  {' '}clicks • $

  {(geoStats[country]?.revenue || 0)
    .toFixed(2)}

</strong>

            </div>

          )
        )}

      </div>

      {/* ÚLTIMOS CLICKS */}

      <div
        style={{
          background: '#14213d',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          overflowX: 'auto',
        }}
      >

        <h2 style={{ marginBottom: '20px' }}>
          📊 Últimos Clicks
        </h2>

        <table
          width="100%"
          style={{
            borderCollapse: 'collapse'
          }}
        >

          <thead>
            <tr style={{ color: '#8ea0ff' }}>
              <th align="left">ID</th>
              <th align="left">Campanha</th>
              <th align="left">Dispositivo</th>
              <th align="left">IP</th>
            </tr>
          </thead>

          <tbody>

            {filteredClicks.slice(0, 20).map(click => (

              <tr key={click.id}>

                <td style={td}>
                  {click.id}
                </td>

                <td style={td}>
                  {click.campanha}
                </td>

                <td style={td}>
                  {click.dispositivo}
                </td>

                <td style={td}>
                  {click.ip}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* CONVERSÕES */}

      <div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px',
    overflowX: 'auto',
  }}
>

        <h2 style={{ marginBottom: '20px' }}>
          💰 Últimas Conversões
        </h2>

        <table
          width="100%"
          style={{
            borderCollapse: 'collapse'
          }}
        >

          <thead>
            <tr style={{ color: '#8ea0ff' }}>
              <th align="left">Click ID</th>
              <th align="left">FBCLID</th>
              <th align="left">Payout</th>
              <th align="left">Campanha</th>
              <th align="left">Dispositivo</th>
              <th align="left">Data</th>
              
            </tr>
          </thead>

          <tbody>

            {(filteredConversions || []).slice(0, 20).map(conv => (

              <tr key={conv.id}>

                <td style={td}>
                  {conv.click_id}
                </td>

                <td style={td}>
                  {conv.fbclid}
                </td>

                <td style={td}>
                  ${conv.payout}
                </td>
                <td style={td}>
  {conv.campanha || '-'}
</td>

<td style={td}>
  {conv.dispositivo || '-'}
</td>

<td style={td}>
  {
    conv.created_at
      ? new Date(
          new Date(conv.created_at)
            .getTime() - (3 * 60 * 60 * 1000)
        ).toLocaleString('pt-BR')
      : '-'
  }
</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

     {
  showCampaignModal && (
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
        <h2 style={{ marginBottom: '20px' }}>
          Nova Campanha
        </h2>

        <input
          value={editingCampaign ? editName : newCampaignName}
          onChange={(e) => {

  if (editingCampaign) {
    setEditName(e.target.value)
  } else {
    setNewCampaignName(e.target.value)
  }

}}
          placeholder="Nome da campanha"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: 'none'
  }}
/>

        <input
          value={editingCampaign ? editOffer : newCampaignOffer}
          onChange={(e) => {

  if (editingCampaign) {
    setEditOffer(e.target.value)
  } else {
    setNewCampaignOffer(e.target.value)
  }

}}
  placeholder="URL da oferta"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: 'none'
          }}
        />

        <input
          value={editingCampaign ? editSpend : newCampaignSpend}
          onChange={(e) => {

  if (editingCampaign) {
    setEditSpend(e.target.value)
  } else {
    setNewCampaignSpend(e.target.value)
  }

}}
          placeholder="Spend"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none'
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
  Criar campanha
</button>

        <button
          onClick={() => setShowCampaignModal(false)}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
  }}
>
  Fechar
</button>
      </div>
    </div>
  )
} 

   </div>

  )
  }

const cardStyle = {
  background: '#14213d',
  padding: '25px',
  borderRadius: '20px'
}

const tableStyle = {
  padding: '14px',
  textAlign: 'left',
  color: '#8ea2ff',
  borderBottom: '1px solid #1f2d52'
}
const td = {
  padding: '14px 0',
  borderBottom: '1px solid #1f2d52'
}