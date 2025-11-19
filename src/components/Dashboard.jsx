import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white/70 backdrop-blur border border-sky-100">
      <div className="text-sm text-sky-700">{label}</div>
      <div className="text-2xl font-bold text-sky-900">{value}</div>
    </div>
  )
}

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    companies: 0,
    periods: 0,
    placements: 0,
    pendingLogs: 0,
  })

  const load = async () => {
    const [c,p,l,lg] = await Promise.all([
      fetch(`${API}/companies`).then(r=>r.json()),
      fetch(`${API}/periods`).then(r=>r.json()),
      fetch(`${API}/placements`).then(r=>r.json()),
      fetch(`${API}/logs`).then(r=>r.json()),
    ])
    setStats({
      companies: c.length,
      periods: p.length,
      placements: l.length,
      pendingLogs: lg.filter(x=>x.status==='submitted').length
    })
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-sky-900">Halo, {user.name}</h2>
        <p className="text-sky-700">Selamat datang di dashboard PKL. Kelola dan pantau aktivitasmu di sini.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Mitra" value={stats.companies} />
        <Stat label="Periode" value={stats.periods} />
        <Stat label="Penempatan" value={stats.placements} />
        <Stat label="Log Pending" value={stats.pendingLogs} />
      </div>
    </div>
  )
}

export default Dashboard
