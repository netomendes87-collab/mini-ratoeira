'use client'

import {
  useEffect,
  useState,
  useMemo
} from 'react'

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

  const [clicks, setClicks] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [conversions, setConversions] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchData() {
      await loadData()
    }

    fetchData()

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
        
      }

      
      setCampaigns(campaignsData || [])

      setLoading(false)

      

    } catch (err) {

      

    }

  }

  // MÉTRICAS


// MÉTRICAS

const totalRevenue = useMemo(() => {

  return (conversions || []).reduce(
    (acc, conv) => {

      return acc + Number(
        conv.payout ||
        conv.commission ||
        0
      )

    },
    0
  )

}, [conversions])

const totalSpend = useMemo(() => {

  return (campaigns || []).reduce(
    (acc, campaign) => {

      return acc + Number(campaign.spend || 0)

    },
    0
  )

}, [campaigns])

const totalConversions = useMemo(() => {

  return conversions.length

}, [conversions])

const totalClicks = useMemo(() => {

  return clicks.length

}, [clicks])

const epc =
  totalClicks > 0
    ? (
        totalRevenue / totalClicks
      ).toFixed(2)
    : 0

const conversionRate =
  totalClicks > 0
    ? (
        (totalConversions / totalClicks) * 100
      ).toFixed(2)
    : 0

  const profit = totalRevenue - totalSpend

  const roi =
    totalSpend > 0
      ? (
          (profit / totalSpend) * 100
        ).toFixed(2)
      : 0

  const desktopClicks =
    (clicks || []).filter(
      click => click.dispositivo === 'desktop'
    ).length

  const mobileClicks =
    (clicks || []).filter(
      click => click.dispositivo === 'mobile'
    ).length

  const uniqueCampaigns =
    [
      ...new Set(
        (clicks || []).map(
          click => click.campanha
        )
      )
    ].length

  // PAÍSES

  const countryStats = {}

  ;(clicks || []).forEach(click => {

    const country =
      click.pais || 'Desconhecido'

    countryStats[country] =
      (countryStats[country] || 0) + 1

  })

   // GRÁFICO

const chartData =
  (clicks || []).map((click, index) => ({
    name: `#${index + 1}`,
    clicks: index + 1
  }))

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
    padding: '40px'
  }}
>

<div
  style={{
    maxWidth: '1700px',
    margin: '0 auto'
  }}
>

</div>
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  }}
>

  <div>
    <h1
      style={{
        fontSize: '48px',
        marginBottom: '10px'
      }}
    >
      🚀 Mini Ratoeira
    </h1>

    <p
      style={{
        color: '#6fa8ff',
        fontSize: '18px'
      }}
    >
      Tracker avançado de campanhas
    </p>
  </div>

  <div
    style={{
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}
  >

    <select
      style={{
        background: '#13234a',
        color: 'white',
        border: '1px solid #29407a',
        padding: '12px 18px',
        borderRadius: '12px',
        fontSize: '16px'
      }}
    >
      <option>Hoje</option>
      <option>7 Dias</option>
      <option>30 Dias</option>
    </select>

    <button
      style={{
        background: '#22c55e',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '14px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 0 15px rgba(34,197,94,0.3)'
      }}
    >
      + Nova Campanha
    </button>

  </div>

</div>

{/* CARDS */}

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  }}
>

  <div style={cardStyle}>
    <h3>🖱️ Total Clicks</h3>
    <h1>{totalClicks}</h1>
  </div>

  <div style={cardStyle}>
    <h3>📂 Campanhas</h3>
    <h1>{uniqueCampaigns.length}</h1>
  </div>

  <div style={cardStyle}>
    <h3>💻 Desktop</h3>
    <h1>{desktopClicks}</h1>
  </div>

  <div style={cardStyle}>
    <h3>📱 Mobile</h3>
    <h1>{mobileClicks}</h1>
  </div>

  <div style={cardStyle}>
    <h3>🎯 Conversões</h3>
    <h1>{totalConversions}</h1>
  </div>

  <div style={cardStyle}>
    <h3>💰 Revenue</h3>
    <h1>
      ${Number(totalRevenue || 0).toFixed(2)}
    </h1>
  </div>

  <div style={cardStyle}>
    <h3>📈 CR%</h3>
    <h1>{conversionRate}%</h1>
  </div>

  <div style={cardStyle}>
    <h3>⚡ EPC</h3>
    <h1>
      ${Number(epc || 0).toFixed(2)}
    </h1>
  </div>

  <div style={cardStyle}>
    <h3>💸 Spend</h3>
    <h1>
      ${Number(totalSpend || 0).toFixed(2)}
    </h1>
  </div>

  <div style={cardStyle}>
    <h3>🧾 Profit</h3>
    <h1
      style={{
        color:
          profit >= 0
            ? '#4ade80'
            : '#ef4444'
      }}
    >
      ${Number(profit || 0).toFixed(2)}
    </h1>
  </div>

  <div style={cardStyle}>
    <h3>📊 ROI</h3>
    <h1
      style={{
        color:
          roi >= 0
            ? '#4ade80'
            : '#ef4444'
      }}
    >
      {Number(roi || 0).toFixed(2)}%
    </h1>
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
          height={420}

       >

          <LineChart data={chartData}>

            <CartesianGrid
              stroke="#22345f"
              strokeDasharray="4 4"

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
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: 6
            }}
            
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

              <strong>{total} clicks</strong>

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
          marginBottom: '30px'
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

            {clicks.map(click => (

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
          padding: '20px'
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

            {(conversions || []).map(conv => (

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

   </div>


  )
  }

const cardStyle = {
  background: '#14213d',
  padding: '25px',
  borderRadius: '20px'
}

const td = {
  padding: '14px 0',
  borderBottom: '1px solid #1f2d52'
}