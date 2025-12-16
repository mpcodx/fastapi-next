import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('http://localhost:8000/users', {
      headers: { token }
    })
      .then(r => r.json())
      .then(setUsers)
      .catch(err => setError(err.toString()))
  }, [])

  return (
    <div className="container">
      <h1>FastAPI + Next.js frontend</h1>

      <section>
        <h2>Users</h2>
        {error && <pre className="error">{error}</pre>}
        <ul>
          {users && users.map(u => (
            <li key={u.id}>{u.name} — {u.email}</li>
          ))}
        </ul>
      </section>

      <style jsx>{`
        .container { max-width: 700px; margin: 40px auto; font-family: system-ui, sans-serif }
        .error { color: red }
      `}</style>
    </div>
  )
}
