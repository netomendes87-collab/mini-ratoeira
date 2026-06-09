'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  calculateMetrics
} from '@/lib/dashboard/metrics'
import {
  calculateFraud
} from '@/lib/dashboard/fraud'
import {
  calculateCampaigns
} from '@/lib/dashboard/campaigns'
import {
  calculateAlerts
} from '@/lib/dashboard/alerts'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

import StatsCards from '../components/dashboard/cards/StatsCards'
import FinancialChart from '../components/dashboard/charts/FinancialChart'
import ActivityFeed from '../components/dashboard/feeds/ActivityFeed'
import LiveVisitors from '../components/dashboard/feeds/LiveVisitors'
import CampaignTable from '../components/dashboard/tables/CampaignTable'
import MapWorld from '../components/dashboard/charts/MapWorld'
import AntiFraud from '../components/dashboard/AntiFraud'
import TrafficQuality from '../components/dashboard/TrafficQuality'
import GeoPerformance from '../components/dashboard/GeoPerformance'
import OfferPerformance from '../components/dashboard/OfferPerformance'
import TopKeywords from '../components/dashboard/TopKeywords'
import AITrafficScore from '../components/dashboard/cards/AITrafficScore'
import Alerts from '../components/dashboard/Alerts'
import useDashboardData from '@/lib/dashboard/useDashboardData'
import {calculateAnalytics} from '@/lib/dashboard/analytics'
import {buildTrafficSources} from '@/lib/services/traffic'
import {buildKeywordStats} from '@/lib/services/keywords'
import {buildGeoPerformance,buildMapData} from '@/lib/services/geo'
import {buildOfferPerformance} from '@/lib/services/offers'
import {buildBlacklistIPs} from '@/lib/services/blacklist'
import {buildDailyStats} from '@/lib/services/daily'
import {buildHourStats} from '@/lib/services/hours'
import {buildActivityFeed} from '@/lib/services/activity'
import {buildDeviceStats,buildUniqueCampaigns} from '@/lib/services/devices'
import {buildFraudStats,buildTrafficQualityStats} from '@/lib/services/fraud'
import ClickDetailsModal from '../components/dashboard/modals/ClickDetailsModal'
import CampaignModal from '../components/dashboard/modals/CampaignModal'
import TrafficSources from '../components/dashboard/tables/TrafficSources'
import TrafficScore from '../components/dashboard/cards/TrafficScore'
import SuspiciousTraffic from '../components/dashboard/tables/SuspiciousTraffic'
import AutoBlacklist from '../components/dashboard/tables/AutoBlacklist'



const pulseAnimation = `
@keyframes shine {

  0% {
    left: -120%;
  }

  100% {
    left: 130%;
  }

}

@keyframes pulse {

  0% {
    transform: scale(1);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.35);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0.6;
  }

}
`
export default function Dashboard() {
  const router = useRouter()

  const [liveVisitors, setLiveVisitors] =
  useState([])
  
  const [activityFeed, setActivityFeed] =
  useState([])

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

  const [selectedClick,setSelectedClick] = useState(null)
  const [editingCampaignId, setEditingCampaignId] = useState(null)
  const [selectedCampaign, setSelectedCampaign] =
  useState('all')

  const [selectedPeriod, setSelectedPeriod] =
  useState('all')

  const [showCampaignModal, setShowCampaignModal] =
  useState(false)

  const [newCampaignName, setNewCampaignName] =
  useState('')

  const [newCampaignOffer, setNewCampaignOffer] =
  useState('')

  const [newCampaignSpend, setNewCampaignSpend] =
  useState('')
  const {
  clicks,
  conversions,
  campaigns,
  loading,
  loadData
} = useDashboardData()
       
  async function handleBlockIP(ip) {

  const { error } = await supabase
    .from('blacklist')
    .insert([
      {
        ip
      }
    ])

  if (error) {

    console.log(error)

    alert('Erro ao bloquear IP')

    return

  }

  alert(`IP ${ip} bloqueado com sucesso`)

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

useEffect(() => {

  setLiveVisitors(
    [...filteredClicks]
      .reverse()
      .slice(0, 8)
  )

}, [clicks, selectedCampaign, selectedPeriod])

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

useEffect(() => {

  setActivityFeed(
    buildActivityFeed(
      filteredClicks,
      filteredConversions
    )
  )

}, [
  clicks,
  conversions,
  selectedCampaign,
  selectedPeriod
])

const {
  totalConversions,
  totalRevenue,
  totalSpend,
  totalClicks,
  epc,
  conversionRate,
  profit,
  roi
} = calculateMetrics({
  filteredClicks,
  filteredConversions,
  campaigns,
  selectedCampaign
})

const {
  desktopClicks,
  mobileClicks
} = buildDeviceStats(
  filteredClicks
)

// ANTI-FRAUDE

const {
  botClicks,
  vpnClicks,
  proxyClicks,
  datacenterClicks,
  cleanClicks,
  trafficScore,
  trafficQuality
} = calculateFraud(
  filteredClicks
)

const fraudStats =
  buildFraudStats(
    botClicks,
    vpnClicks,
    proxyClicks,
    datacenterClicks,
    cleanClicks
  )

const trafficSources =
  buildTrafficSources(filteredClicks)

const keywordStats =
  buildKeywordStats(
    filteredClicks,
    filteredConversions
  )

const countryStats = {}

filteredClicks.forEach((click) => {
  const country =
    click.pais || 'Desconhecido'

  countryStats[country] =
    (countryStats[country] || 0) + 1
})

const geoPerformance =
  buildGeoPerformance(
    filteredClicks,
    filteredConversions
  )



const mapData =
  buildMapData(
    geoPerformance
  )

const {
  deviceStats,
  browserStats,
  osStats,
  ispStats
} = calculateAnalytics({
  filteredClicks,
  filteredConversions,
  campaigns
})

const {
  campaignStats,
  aiCampaignScore,
  deadCampaigns,
  negativeROI
} = calculateCampaigns({
  filteredClicks,
  filteredConversions,
  campaigns
})
const alerts =
  calculateAlerts(
    campaignStats
  )

const uniqueCampaigns =
  buildUniqueCampaigns(
    filteredClicks
  )

// GRÁFICO
const hourStats =
  buildHourStats(
    filteredClicks,
    filteredConversions
  )

const dailyStats =
  buildDailyStats(
    filteredClicks,
    filteredConversions,
    campaigns
  )

const handleCreateCampaign = async () => {
  try {

    if (editingCampaignId) {

      const { error } = await supabase
        .from('campaigns')
        .update({
          name: newCampaignName,
          offer: newCampaignOffer,
          spend: Number(newCampaignSpend)
        })
        .eq('id', editingCampaignId)

      if (error) {
        console.error(error)
        return
      }

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
        return
      }

    }

    setNewCampaignName('')
    setNewCampaignOffer('')
    setNewCampaignSpend('')

    setEditingCampaignId(null)

    setShowCampaignModal(false)

    loadData()

  } catch (err) {
    console.error(err)
  }
}

const suspiciousClicks =
  filteredClicks.filter(
    (click) =>
      click.is_bot === true ||
      click.is_vpn === true ||
      click.is_proxy === true ||
      click.is_datacenter === true
  )
const trafficQualityStats =
  buildTrafficQualityStats(
    cleanClicks,
    botClicks,
    vpnClicks,
    proxyClicks,
    datacenterClicks
  )

const blacklistIPs =
  buildBlacklistIPs(
    suspiciousClicks
  )

const offerPerformanceAI =
  buildOfferPerformance(
    filteredClicks,
    filteredConversions
  )

const chartData = Object.entries(
  dailyStats
).map(([day, data]) => ({

  day,

  revenue:
    data.revenue,

  spend:
    data.spend,

  profit:
    data.revenue -
    data.spend

}))

if (loading) {
  return (
    <>
     <style>
       {pulseAnimation}
     </style>

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
    </>
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

    <StatsCards
       totalClicks={totalClicks}
       uniqueCampaigns={uniqueCampaigns}
       desktopClicks={desktopClicks}
       mobileClicks={mobileClicks}
       totalConversions={totalConversions}
       totalRevenue={totalRevenue}
       conversionRate={conversionRate}
       epc={epc}
       totalSpend={totalSpend}
       profit={profit}
       roi={roi}
    />

<FinancialChart
  chartData={chartData}
/>


{/* ISP PERFORMANCE */}
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
    🌐 ISP Performance
  </h2>

  <table
    style={{
      width: '100%'
    }}
  >
    <thead>
      <tr>
        <th style={tableStyle}>
          ISP
        </th>

        <th style={tableStyle}>
          Clicks
        </th>

        <th style={tableStyle}>
          Conv
        </th>

        <th style={tableStyle}>
          Revenue
        </th>

        <th style={tableStyle}>
          CR%
        </th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(ispStats)
        .sort(
          (a, b) =>
            b[1].revenue -
            a[1].revenue
        )
        .map(([isp, data]) => (
          <tr key={isp}>
            <td style={td}>
              {isp}
            </td>

            <td style={td}>
              {data.clicks}
            </td>

            <td style={td}>
              {data.conversions}
            </td>

            <td style={td}>
              ${data.revenue}
            </td>

            <td style={td}>
              {
                data.clicks > 0
                  ? (
                      (data.conversions /
                        data.clicks) *
                      100
                    ).toFixed(1)
                  : 0
              }%
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* OS PERFORMANCE */}
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
    🧠 OS Performance
  </h2>

  <table
    style={{
      width: '100%'
    }}
  >
    <thead>
      <tr>
        <th style={tableStyle}>
          OS
        </th>

        <th style={tableStyle}>
          Clicks
        </th>

        <th style={tableStyle}>
          Conv
        </th>

        <th style={tableStyle}>
          Revenue
        </th>

        <th style={tableStyle}>
          CR%
        </th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(osStats)
        .sort(
          (a, b) =>
            b[1].revenue -
            a[1].revenue
        )
        .map(([os, data]) => (
          <tr key={os}>
            <td style={td}>
              {os}
            </td>

            <td style={td}>
              {data.clicks}
            </td>

            <td style={td}>
              {data.conversions}
            </td>

            <td style={td}>
              ${data.revenue}
            </td>

            <td style={td}>
              {
                data.clicks > 0
                  ? (
                      (data.conversions /
                        data.clicks) *
                      100
                    ).toFixed(1)
                  : 0
              }%
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* BROWSER PERFORMANCE */}
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
    🌐 Browser Performance
  </h2>

  <table
    style={{
      width: '100%'
    }}
  >
    <thead>
      <tr>
        <th style={tableStyle}>
          Browser
        </th>

        <th style={tableStyle}>
          Clicks
        </th>

        <th style={tableStyle}>
          Conv
        </th>

        <th style={tableStyle}>
          Revenue
        </th>

        <th style={tableStyle}>
          CR%
        </th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(browserStats)
        .sort(
          (a, b) =>
            b[1].revenue -
            a[1].revenue
        )
        .map(([browser, data]) => (
          <tr key={browser}>
            <td style={td}>
              {browser}
            </td>

            <td style={td}>
              {data.clicks}
            </td>

            <td style={td}>
              {data.conversions}
            </td>

            <td style={td}>
              ${data.revenue}
            </td>

            <td style={td}>
              {
                data.clicks > 0
                  ? (
                      (data.conversions /
                        data.clicks) *
                      100
                    ).toFixed(1)
                  : 0
              }%
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* PROFIT DIÁRIO */}
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
    📈 Profit Diário
  </h2>

  <table
    style={{
      width: '100%'
    }}
  >
    <thead>
      <tr>
        <th style={tableStyle}>
          Dia
        </th>

        <th style={tableStyle}>
          Revenue
        </th>

        <th style={tableStyle}>
          Spend
        </th>

        <th style={tableStyle}>
          Profit
        </th>

        <th style={tableStyle}>
          ROI
        </th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(dailyStats)
        .sort()
        .map(([day, data]) => {

          const profit =
            data.revenue - data.spend

          const roi =
            data.spend > 0
              ? (
                  (profit /
                    data.spend) *
                  100
                ).toFixed(1)
              : 0

          return (
            <tr key={day}>
              <td style={td}>
                {day}
              </td>

              <td style={td}>
                ${data.revenue}
              </td>

              <td style={td}>
                ${data.spend}
              </td>

              <td
                style={{
                  ...td,
                  color:
                    profit >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                ${profit}
              </td>

              <td
                style={{
                  ...td,
                  color:
                    roi >= 0
                      ? '#4ade80'
                      : '#ff4d4f'
                }}
              >
                {roi}%
              </td>
            </tr>
          )

        })}
    </tbody>
  </table>
</div>

<ActivityFeed
  activities={activityFeed}
/>

<LiveVisitors
  visitors={liveVisitors}
/>

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
        <th align="left">Ações</th>
        
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

            <td style={td}>

               <button
                onClick={() =>
                  setSelectedClick(click)
              }
                style={{
                  background: '#2563eb',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer'
              }}
           >
             Ver
           </button>

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

<MapWorld
  mapData={mapData}
/>

<TrafficScore
  trafficScore={trafficScore}
  trafficQuality={trafficQuality}
/>

<AntiFraud
  botClicks={botClicks}
  vpnClicks={vpnClicks}
  proxyClicks={proxyClicks}
  datacenterClicks={datacenterClicks}
  cleanClicks={cleanClicks}
/>

<SuspiciousTraffic
  suspiciousClicks={suspiciousClicks}
  tableStyle={tableStyle}
  td={td}
/>

<TrafficSources
  trafficSources={trafficSources}
  tableStyle={tableStyle}
  td={td}
/>

<AutoBlacklist
  blacklistIPs={blacklistIPs}
  tableStyle={tableStyle}
  td={td}
/>

<TrafficQuality
  trafficQualityStats={
    trafficQualityStats
  }
/>

<GeoPerformance
  geoPerformance={geoPerformance}
/>

<OfferPerformance
  offerPerformanceAI={
    offerPerformanceAI
  }
/>

{/* ROI NEGATIVO */}

{negativeROI.length > 0 && (

  <div
    style={{
      background: '#14213d',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '30px'
    }}
  >

    <h3
      style={{
        color: '#ff9900'
      }}
    >
      ⚠️ ROI Negativo
    </h3>

    <table
      style={{
        width: '100%',
        marginTop: '15px'
      }}
    >

      <thead>
        <tr>

          <th style={tableStyle}>
            Campanha
          </th>

          <th style={tableStyle}>
            ROI
          </th>

          <th style={tableStyle}>
            Revenue
          </th>

          <th style={tableStyle}>
            Spend
          </th>

        </tr>
      </thead>

      <tbody>

        {negativeROI.map(
          ([name, data]) => {

            const roi =
              (
                (
                  (data.revenue -
                    data.spend) /
                  data.spend
                ) * 100
              ).toFixed(1)

            return (

              <tr key={name}>

                <td style={td}>
                  {name}
                </td>

                <td
                  style={{
                    ...td,
                    color: '#ff9900'
                  }}
                >
                  {roi}%
                </td>

                <td style={td}>
                  ${data.revenue}
                </td>

                <td style={td}>
                  ${data.spend}
                </td>

              </tr>

            )

          }
        )}

      </tbody>

    </table>

  </div>

)}

{/* CAMPANHAS MORTAS */}

{deadCampaigns.length > 0 && (

  <div
    style={{
      background: '#14213d',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '30px'
    }}
  >

    <h3
      style={{
        color: '#ff4d4d'
      }}
    >
      🚨 Campanhas Mortas
    </h3>

    <table
      style={{
        width: '100%',
        marginTop: '15px'
      }}
    >

      <thead>
        <tr>
          <th style={tableStyle}>
            Campanha
          </th>

          <th style={tableStyle}>
            Spend
          </th>

          <th style={tableStyle}>
            Conversões
          </th>

          <th style={tableStyle}>
            Prejuízo
          </th>
        </tr>
      </thead>

      <tbody>

        {deadCampaigns.map(
          ([name, data]) => (

            <tr key={name}>

              <td style={td}>
                {name}
              </td>

              <td style={td}>
                ${data.spend}
              </td>

              <td style={td}>
                {data.conversions}
              </td>

              <td
                style={{
                  ...td,
                  color: '#ff4d4d'
                }}
              >
                ${data.spend}
              </td>

            </tr>

          )
        )}

      </tbody>

    </table>

  </div>

)}

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
  onClick={() => {
  setEditingCampaignId(campaign.id)

  setNewCampaignName(campaign.name || '')
  setNewCampaignOffer(campaign.offer || '')
  setNewCampaignSpend(campaign.spend || '')

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


<CampaignModal
  showCampaignModal={showCampaignModal}
  setShowCampaignModal={setShowCampaignModal}
  newCampaignName={newCampaignName}
  setNewCampaignName={setNewCampaignName}
  newCampaignOffer={newCampaignOffer}
  setNewCampaignOffer={setNewCampaignOffer}
  newCampaignSpend={newCampaignSpend}
  setNewCampaignSpend={setNewCampaignSpend}
  handleCreateCampaign={handleCreateCampaign}
  editingCampaignId={editingCampaignId}
/>

<ClickDetailsModal
  selectedClick={selectedClick}
  setSelectedClick={setSelectedClick}
  handleBlockIP={handleBlockIP}
/>

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