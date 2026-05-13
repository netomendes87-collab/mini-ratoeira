'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {

      alert(error.message)

      return
    }

    window.location.href = '/dashboard'
  }

  return (

    <div style={{
      background: '#020617',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial'
    }}>

      <div style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '15px',
        width: '400px'
      }}>

        <h1 style={{
          color: 'white',
          marginBottom: '30px'
        }}>
          🚀 Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none'
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none'
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '15px',
            background: '#38bdf8',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Entrar
        </button>

      </div>

    </div>
  )
}