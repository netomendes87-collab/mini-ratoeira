'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Dashboard() {

  const [clicks, setClicks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function checkUser() {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {

        window.location.href = '/login'

        return
      }

      loadClicks()
    }

    async function loadClicks() {

      const { data } = await supabase
        .from('clicks')
        .select('*')
        .order('id', { ascending: false })

      setClicks(data || [])

      setLoading(false)
    }

    checkUser()

  }, [])

  async function handleLogout() {

    await supabase.auth.signOut()

    window.location.href = '/login'
  }

  if (loading) {

    return (

      <div style={{
        background: '#020617',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px'
      }}>
        Carregando...
      </div>

    )
  }

  const filteredClicks = clicks.filter((click) => {

    return (
      click.campaign?.toLowerCase()
        .includes(search.toLowerCase())
    )

  })

  const totalClicks = filteredClicks.length

  const mobileClicks =
    filteredClicks.filter(
      click => click.device === 'mobile'
    ).length

  const desktopClicks =
    filteredClicks.filter(
      click => click.device === 'desktop'
    ).length

  const countries =
    [...new Set(
      filteredClicks.map(click => click.country)
    )]

  const chartData = filteredClicks.map((click, index) => ({
    name: index + 1,
    clicks: index + 1
  }))

  return (

    <div style={{
      display: 'flex',
      background: '#020617'
    }}>

      <div style={{
        width: '250px',
        background: '#020617',
        minHeight: '100vh',
        padding: '30px',
        borderRight: '1px solid #1e293b'
      }}>

        <h2 style={{
          marginBottom: '40px',
          color: '#38bdf8'
        }}>
          🚀 Mini Ratoeira
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          color: '#cbd5e1'
        }}>

          <div>📊 Dashboard</div>
          <div>🖱️ Cliques</div>
          <div>📈 Analytics</div>

          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>

        </div>

      </div>

      <div style={{
        background: '#0f172a',
        minHeight: '100vh',
        color: 'white',
        padding: '30px',
        fontFamily: 'Arial',
        width: '100%'
      }}>

        <h1 style={{
          fontSize: '40px',
          marginBottom: '30px'
        }}>
          Dashboard
        </h1>

        <input
          placeholder="Buscar campanha..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: '300px',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            marginBottom: '30px',
            background: '#1e293b',
            color: 'white'
          }}
        />

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>

          <div style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            width: '220px'
          }}>

            <h3>Total Cliques</h3>

            <p style={{
              fontSize: '40px',
              fontWeight: 'bold'
            }}>
              {totalClicks}
            </p>

          </div>

          <div style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            width: '220px'
          }}>

            <h3>Mobile</h3>

            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#4ade80'
            }}>
              {mobileClicks}
            </p>

          </div>

          <div style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            width: '220px'
          }}>

            <h3>Desktop</h3>

            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#38bdf8'
            }}>
              {desktopClicks}
            </p>

          </div>

          <div style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            width: '220px'
          }}>

            <h3>Países</h3>

            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#facc15'
            }}>
              {countries.length}
            </p>

          </div>

        </div>

        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>

          <h2 style={{
            marginBottom: '20px'
          }}>
            📈 Cliques em Tempo Real
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={chartData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#38bdf8"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '15px',
          overflowX: 'auto'
        }}>

          <h2 style={{
            marginBottom: '20px'
          }}>
            📋 Últimos Cliques
          </h2>

          <table
            width="100%"
            cellPadding="15"
            style={{
              borderCollapse: 'collapse'
            }}
          >

            <thead>

              <tr style={{
                color: '#94a3b8',
                textAlign: 'left',
                borderBottom: '1px solid #334155'
              }}>

                <th>ID</th>
                <th>Campanha</th>
                <th>Keyword</th>
                <th>Dispositivo</th>
                <th>País</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Horário</th>

              </tr>

            </thead>

            <tbody>

              {filteredClicks.map((click) => (

                <tr
                  key={click.id}
                  style={{
                    borderBottom: '1px solid #334155'
                  }}
                >

                  <td>{click.id}</td>

                  <td style={{
                    color: '#38bdf8'
                  }}>
                    {click.campaign}
                  </td>

                  <td style={{
                    color: '#4ade80'
                  }}>
                    {click.keyword}
                  </td>

                  <td>

                    <span style={{
                      background:
                        click.device === 'mobile'
                          ? '#14532d'
                          : '#1e3a8a',

                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>

                      {click.device}

                    </span>

                  </td>

                  <td>{click.country}</td>
                  <td>{click.browser}</td>
                  <td>{click.os}</td>

                  <td>

                    {new Date(
                      click.created_at
                    ).toLocaleString('pt-BR')}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}