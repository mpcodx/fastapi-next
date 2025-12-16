import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const router = useRouter()

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    const res = await fetch('http://localhost:8000/me', { headers: { token } })
    if (!res.ok) {
      localStorage.removeItem('token')
      return router.push('/login')
    }
    const data = await res.json()
    setUser(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    const body = { name: e.target.name.value, email: e.target.email.value }
    if (e.target.password.value) body.password = e.target.password.value
    const res = await fetch('http://localhost:8000/users/me', {
      method: 'PUT', headers: { 'Content-Type':'application/json', token }, body: JSON.stringify(body)
    })
    if (res.ok) {
      setMsg('Profile updated')
      load()
    } else {
      setMsg('Update failed: ' + await res.text())
    }
  }

  const signout = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    await fetch('http://localhost:8000/signout', { method: 'POST', headers: { token } })
    localStorage.removeItem('token')
    router.push('/login')
  }

  const remove = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8000/users/me', { method: 'DELETE', headers: { token } })
    if (res.ok) {
      localStorage.removeItem('token')
      router.push('/signup')
    } else {
      setMsg('Delete failed: ' + await res.text())
    }
  }

  if (loading) return <p className="container mt-8">Loading...</p>

  return (
    <div className="container mt-8">
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        {msg && <p className="mb-3">{msg}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" defaultValue={user.name} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" defaultValue={user.email} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">New password (leave blank to keep current)</label>
            <input name="password" type="password" className="w-full border rounded p-2" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="btn" type="submit">Update</button>
            <button className="btn" type="button" onClick={signout}>Signout</button>
            <button className="btn-danger ml-auto" type="button" onClick={remove}>Delete account</button>
          </div>
        </form>
      </div>
    </div>
  )
}
