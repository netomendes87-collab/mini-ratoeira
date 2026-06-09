'use client'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

export default function MapWorld({
  mapData
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
        🗺️ Mapa Mundial de Cliques
      </h2>

      <div
        style={{
          width: '100%',
          height: '500px'
        }}
      >

        <ComposableMap
          projectionConfig={{
            scale: 140
          }}
          width={980}
          height={500}
          style={{
            width: '100%',
            height: '100%'
          }}
        >

          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">

            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1f2d52"
                  stroke="#2d3f6b"
                  style={{
                    default: {
                      outline: 'none'
                    },
                    hover: {
                      fill: '#2563eb',
                      outline: 'none'
                    },
                    pressed: {
                      outline: 'none'
                    }
                  }}
                />
              ))
            }

          </Geographies>

          {mapData?.map((item, index) => (

            <Marker
              key={index}
              coordinates={item.coordinates}
            >

              <circle
                r={
                  item.clicks > 20
                    ? 12
                    : item.clicks > 10
                    ? 8
                    : 5
                }
                fill="#4ade80"
                stroke="#fff"
                strokeWidth={2}
              />

              <text
                textAnchor="middle"
                y={-15}
                style={{
                  fill: '#fff',
                  fontSize: '12px'
                }}
              >
                {item.clicks}
              </text>

            </Marker>

          ))}

        </ComposableMap>

      </div>
    </div>
  )
}