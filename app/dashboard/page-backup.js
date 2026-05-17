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
        console.log(clicksError)
      }

      setClicks(clicksData || [])

      console.log('CLICKS:')
      console.log(clicksData)
      console.log(clicksError)

      // CONVERSIONS
      const {
        data: conversionsData,
        error: conversionsError
      } = await supabase
        .from('conversions')
        .select('*')
        .order('id', { ascending: false })

      if (conversionsError) {
        console.log(conversionsError)
      }

      setConversions(conversionsData || [])

      console.log('CONVERSIONS:')
      console.log(conversionsData)
      console.log(conversionsError)

      console.log('TESTE PAYOUT:')
      console.log(conversionsData?.[0])

      // CAMPAIGNS
      const {
        data: campaignsData,
        error: campaignsError
      } = await supabase
        .from('campaigns')
        .select('*')

      if (campaignsError) {
        console.log(campaignsError)
      }

      setCampaigns(campaignsData || [])

      console.log('CAMPAIGNS:')
      console.log(campaignsData)
      console.log(campaignsError)

    } catch (err) {

      console.log(err)

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

if (
  clicks.length === 0 &&
  conversions.length === 0 &&
  campaigns.length === 0
) {

  return (
    <div
      style={{
        background: '#020c2b',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
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
    <h1
      style={{
        marginBottom: '30px',
        fontSize: '42px'
      }}
    >
      🚀 Mini Ratoeira
    </h1>

    {/* CARDS */}

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
        <h1>{uniqueCampaigns}</h1>
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
        <h1>${totalRevenue}</h1>
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
        <h1>${totalSpend}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Profit</h3>
        <h1>${profit}</h1>
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