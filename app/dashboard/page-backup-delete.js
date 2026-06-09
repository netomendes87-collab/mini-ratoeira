'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
          table: 'clicks',
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
          table: 'conversions',
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
      const { data: clicksData, error: clicksError } = await supabase
        .from('clicks')
        .select('*')
        .order('id', { ascending: false })

      if (clicksError) {
        console.error(clicksError)
      }

      setClicks(clicksData || [])

      // CONVERSIONS
      const { data: conversionsData, error: conversionsError } =
        await supabase
          .from('conversions')
          .select('*')
          .order('id', { ascending: false })

      if (conversionsError) {
        console.error(conversionsError)
      }

      setConversions(conversionsData || [])

      // CAMPAIGNS
      const { data: campaignsData, error: campaignsError } = await supabase
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
async function handleDeleteCampaign(id) {
  const confirmar = confirm(
    'Deseja realmente excluir esta campanha?'
  )

  if (!confirmar) return

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)

  if (error) {
    alert('Erro ao excluir campanha')
    console.error(error)
    return
  }

  loadData()
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

  const matchPeriod = isWithinPeriod(
    click.created_at || click.date
  )

  return matchCampaign && matchPeriod
})

// MÉTRICAS
const filteredConversions = conversions.filter((conv) => {
  const matchCampaign =
    selectedCampaign === 'all' ||
    conv.campanha === selectedCampaign

  const matchPeriod = isWithinPeriod(
    conv.created_at || conv.date
  )

  return matchCampaign && matchPeriod
})

const totalConversions = useMemo(() => {
  return filteredConversions.length
}, [filteredConversions])

const totalRevenue = useMemo(() => {
  return (filteredConversions || []).reduce((acc, conv) => {
    return acc + Number(conv.payout || conv.commission || 0)
  }, 0)
}, [filteredConversions])

const totalSpend = useMemo(() => {
  const filteredCampaigns =
    selectedCampaign === 'all'
      ? campaigns
      : campaigns.filter(
          (campaign) =>
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
        (totalConversions / totalClicks) *
        100
      ).toFixed(2)
    : 0

const profit =
  Number(totalRevenue || 0) -
  Number(totalSpend || 0)

const roi =
  totalSpend > 0
    ? ((profit / totalSpend) * 100).toFixed(2)
    : '0.00'

const desktopClicks = (filteredClicks || []).filter(
  (click) => click.dispositivo === 'desktop'
).length

const mobileClicks = (filteredClicks || []).filter(
  (click) => click.dispositivo === 'mobile'
).length

// ANTI-FRAUDE
const botClicks = 0
const vpnClicks = 0
const proxyClicks = 0
const datacenterClicks = 0

const cleanClicks =
  totalClicks -
  botClicks -
  vpnClicks -
  proxyClicks -
  datacenterClicks

const trafficScore =
  totalClicks > 0
    ? Math.round(
        (cleanClicks / totalClicks) * 100
      )
    : 100  

const uniqueCampaigns = [
  ...new Set(
    (filteredClicks || []).map(
      (click) => click.campanha || 'unknown'
    )
  ),
]

// PAÍSES
const countryStats = {}

;(filteredClicks || []).forEach((click) => {
  const country = click.pais || 'Desconhecido'

  countryStats[country] =
    (countryStats[country] || 0) + 1
})

// GRÁFICO
const groupedClicks = {}

;(filteredClicks || []).forEach((click) => {
  const date = new Date(
    click.created_at || click.date
  )

  const label = `${date.getHours()}:00`

  groupedClicks[label] =
    (groupedClicks[label] || 0) + 1
})
const handleCreateCampaign = async () => {

  try {

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

    const { data } = await supabase
      .from('campaigns')
      .select('*')

    setCampaigns(data || [])

    setNewCampaignName('')
    setNewCampaignOffer('')
    setNewCampaignSpend('')

    setShowCampaignModal(false)

    alert('Campanha criada com sucesso!')

  } catch (err) {

    console.error(err)

    alert('Erro inesperado')

  }

}

const chartData = Object.entries(groupedClicks)
  .map(([hour, total]) => ({
    name: hour,
    clicks: total,
  }))
  .sort((a, b) => {
    return parseInt(a.name) - parseInt(b.name)
  })

if (loading) {
  return (
    <div
      style={{
        background: '#020c2b',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
        fontFamily: 'Arial',
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
      fontFamily: 'Arial',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}
    >
      <h1 style={{ fontSize: '42px' }}>
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
          cursor: 'pointer',
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
          border: '1px solid #22345a',
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
        onClick={() =>
          setShowCampaignModal(true)
        }
        style={{
          padding: '12px 20px',
          borderRadius: '12px',
          background: '#22c55e',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginLeft: '10px',
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
          marginLeft: '10px',
        }}
      >
        <option value="all">Tudo</option>
        <option value="today">Hoje</option>
        <option value="7days">7 dias</option>
        <option value="30days">30 dias</option>
      </select>
    </div>

    {/* CARDS */}
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
      $ {Number(totalRevenue || 0).toFixed(2)}
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

{/* GRÁFICO */}
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px',
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

{/* PAÍSES */}

<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px',
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
          borderBottom:
            '1px solid #1f2d52',
        }}
      >
        <span>{country}</span>

        <strong>
          {total} clicks
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
      {filteredClicks
        .slice(0, 20)
        .map(click => (
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

{/* ÚLTIMAS CONVERSÕES */}
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '30px',
    overflowX: 'auto'
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
      </tr>
    </thead>

    <tbody>
      {(filteredConversions || [])
        .slice(0, 20)
        .map(conv => (
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
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* TRAFFIC SCORE */}
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
</div>

{/* ANTI-FRAUDE */}
<div
  style={{
    background: '#14213d',
    borderRadius: '20px',
    padding: '25px',
    marginBottom: '30px',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px'
  }}
>
  <div>
    <h3>🤖 Bots</h3>
    <h2 style={{ color: '#ff4d4d' }}>
      {botClicks}
    </h2>
  </div>

  <div>
    <h3>🛡 VPN</h3>
    <h2 style={{ color: '#ffd600' }}>
      {vpnClicks}
    </h2>
  </div>

  <div>
    <h3>🌐 Proxy</h3>
    <h2 style={{ color: '#ff9900' }}>
      {proxyClicks}
    </h2>
  </div>

  <div>
    <h3>🏢 Datacenter</h3>
    <h2 style={{ color: '#9b59ff' }}>
      {datacenterClicks}
    </h2>
  </div>

  <div>
    <h3>✅ Clicks Limpos</h3>
    <h2 style={{ color: '#4ade80' }}>
      {cleanClicks}
    </h2>
  </div>
</div>

{/* GERENCIAR CAMPANHAS */}
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
        <h3>{campaign.name}</h3>

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
    handleDeleteCampaign(campaign.id)
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

</div>
)
}

const cardStyle = {
  background: '#14213d',
  padding: '25px',
  borderRadius: '20px',
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