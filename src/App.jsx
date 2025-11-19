import { useState } from 'react'
import Header from './components/Header'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { CompanyForm, PeriodForm, QuickLists } from './components/Forms'

function App() {
  const [user, setUser] = useState(null)

  const logout = ()=> setUser(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-babyblue-50 to-coral-50" style={{
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.3), transparent 35%), radial-gradient(circle at 80% 0%, rgba(251, 146, 60, 0.25), transparent 35%), radial-gradient(circle at 80% 80%, rgba(254, 215, 170, 0.25), transparent 35%)'
    }}>
      <Header onLogout={logout} user={user} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!user ? (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-sky-100">
                <h1 className="text-3xl font-extrabold text-sky-900 mb-2">Sistem PKL Mahasiswa</h1>
                <p className="text-sky-700">Catat logbook harian, kehadiran dengan bukti foto dan tanggal upload, penempatan, penilaian rubrik standar, dan notifikasi terpusat dalam satu aplikasi.</p>
                <ul className="list-disc pl-6 text-sky-800 mt-3 space-y-1">
                  <li>Peran: Admin, Koordinator, Dosen, Pembimbing Industri, Mahasiswa</li>
                  <li>Rubrik standar (Teknis 40%, Disiplin 20%, Soft Skills 20%, Laporan 20%)</li>
                  <li>Desain ceria dengan nuansa baby blue dan coral</li>
                </ul>
              </div>
              <QuickLists />
            </div>
            <Auth onLoggedIn={setUser} />
          </div>
        ) : (
          <div className="space-y-8">
            <Dashboard user={user} />

            {(user.role === 'admin' || user.role === 'koordinator') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompanyForm onCreated={()=>{}} />
                <PeriodForm onCreated={()=>{}} />
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/70 border border-sky-100">
              <h3 className="font-semibold text-sky-900">Roadmap Fitur</h3>
              <p className="text-sky-700 text-sm">Selanjutnya akan ditambahkan: alur penempatan, logbook dengan upload foto, kehadiran, evaluasi 360°, serta dashboard per peran.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
