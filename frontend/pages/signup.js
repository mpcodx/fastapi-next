import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    if (res.ok) {
      setMsg('Signup successful — you can now login')
      setName(''); setEmail(''); setPassword('')
      router.push('/login')
    } else {
      const text = await res.text()
      setMsg('Signup failed: ' + text)
    }
  }

  return (
    <div className="container mt-8">
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-4">Signup</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="w-full border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input className="w-full border rounded p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div>
            <button className="btn" type="submit">Signup</button>
          </div>
        </form>
        {msg && <p className="mt-3">{msg}</p>}
      </div>
    </div>
  )
}
