import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Auth({ onLoggedIn }) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'mahasiswa' })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password_hash: form.password, // demo only
            role: form.role,
          })
        })
        if (!res.ok) throw new Error((await res.json()).detail || 'Gagal daftar')
      }
      const resLogin = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      if (!resLogin.ok) throw new Error((await resLogin.json()).detail || 'Login gagal')
      const data = await resLogin.json()
      onLoggedIn(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-sky-900 mb-2">{isRegister ? 'Daftar Akun' : 'Masuk'}</h2>
      <p className="text-sky-700 mb-6">Gunakan email dan pilih peran untuk mencoba alur sistem.</p>
      <form onSubmit={submit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-sky-800 mb-1">Nama</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">Password</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-sky-800 mb-1">Peran</label>
            <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400">
              <option value="mahasiswa">Mahasiswa</option>
              <option value="pembimbing_industri">Pembimbing Industri</option>
              <option value="dosen">Dosen</option>
              <option value="koordinator">Koordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {error && <div className="p-2 text-sm text-white bg-red-500 rounded">{error}</div>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-semibold transition">
          {loading ? 'Memproses...' : (isRegister ? 'Daftar & Masuk' : 'Masuk')}
        </button>
        <button type="button" onClick={()=>setIsRegister(v=>!v)} className="w-full py-2 rounded-lg bg-coral-500/10 text-coral-700 border border-coral-300 hover:bg-coral-500/20 transition">
          {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </button>
      </form>
    </div>
  )
}

export default Auth
