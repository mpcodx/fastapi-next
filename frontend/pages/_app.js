import '../styles/globals.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Header(){
  const router = useRouter()

  const signout = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    try {
      await fetch('http://localhost:8000/signout', { method: 'POST', headers: { token } })
    } catch(e) {
      // ignore network errors; clear local token anyway
    }
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center gap-4 py-3">
        <nav className="flex items-center gap-4 w-full">
          <Link href="/" className="font-semibold">Home</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/login">Login</Link>
          <Link href="/profile">Profile</Link>
          <button onClick={signout} className="btn ml-auto">Signout</button>
        </nav>
      </div>
    </header>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}
