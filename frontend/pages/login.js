import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/')
    } else {
      const text = await res.text()
      setMsg('Login failed: ' + text)
    }
  }

  return (
    <div className="container mt-8">
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="w-full border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input className="w-full border rounded p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div>
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
        {msg && <p className="mt-3">{msg}</p>}
      </div>
    </div>
  )
}
