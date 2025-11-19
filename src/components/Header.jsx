import { useState } from 'react'

function Header({ onLogout, user }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-sky-50/70 border-b border-sky-200/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-coral-400 shadow-inner shadow-white/40 ring-1 ring-white/50 flex items-center justify-center">
            <span className="text-white font-bold">PKL</span>
          </div>
          <div className="font-semibold text-sky-900">Sistem PKL Mahasiswa</div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm text-sky-700">
              {user.name} • <span className="capitalize">{user.role.replace('_',' ')}</span>
            </div>
          )}
          {user && (
            <button onClick={onLogout} className="px-3 py-1.5 text-sm rounded-lg bg-coral-500 text-white hover:bg-coral-600 transition">Keluar</button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
