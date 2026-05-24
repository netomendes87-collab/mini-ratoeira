'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {

    e.preventDefault()

    setLoading(true)

    const { data, error } = 
      await supabase.auth.signInWithPassword({

      email: email.trim(),
      password: password.trim()
      
    })

    if (error) {
      alert('Login inválido')
      setLoading(false)
      return
    }

    router.push('/dashboard')

  }

  return (

    <div
      style={{
        background: '#020c2b',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial'
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          background: '#14213d',
          padding: '40px',
          borderRadius: '20px',
          width: '350px'
        }}
      >

        <h1
          style={{
            color: 'white',
            marginBottom: '30px',
            textAlign: 'center'
          }}
        >
          🚀 Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
        />

        <button
          type="submit"
          style={button}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

      </form>

    </div>

  )

}

const input = {
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: '1px solid #22345a',
  background: '#020c2b',
  color: 'white'
}

const button = {
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: 'none',
  background: '#3b82f6',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
}