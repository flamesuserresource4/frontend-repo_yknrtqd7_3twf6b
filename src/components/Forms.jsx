import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function CompanyForm({ onCreated }) {
  const [form, setForm] = useState({ name:'', address:'', city:'', contact_person:'', contact_email:'', contact_phone:'', positions:'', quota:0 })
  const submit = async (e)=>{
    e.preventDefault()
    const payload = { ...form, positions: form.positions ? form.positions.split(',').map(s=>s.trim()) : [] }
    const res = await fetch(`${API}/companies`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if(res.ok){ onCreated(); setForm({ name:'', address:'', city:'', contact_person:'', contact_email:'', contact_phone:'', positions:'', quota:0 }) }
  }
  return (
    <form onSubmit={submit} className="space-y-3 bg-white/70 border border-sky-100 rounded-xl p-4">
      <h3 className="font-semibold text-sky-900">Tambah Perusahaan</h3>
      <input placeholder="Nama" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200"/>
      <input placeholder="Alamat" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input placeholder="Kota" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
        <input placeholder="Kontak" value={form.contact_person} onChange={e=>setForm({...form,contact_person:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
        <input placeholder="Email Kontak" value={form.contact_email} onChange={e=>setForm({...form,contact_email:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="HP Kontak" value={form.contact_phone} onChange={e=>setForm({...form,contact_phone:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
        <input placeholder="Posisi (pisahkan dengan koma)" value={form.positions} onChange={e=>setForm({...form,positions:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
      </div>
      <input type="number" placeholder="Kuota" value={form.quota} onChange={e=>setForm({...form,quota:parseInt(e.target.value||0)})} className="w-full px-3 py-2 rounded border border-sky-200"/>
      <button className="px-4 py-2 rounded bg-coral-500 text-white">Simpan</button>
    </form>
  )
}

export function PeriodForm({ onCreated }){
  const [form, setForm] = useState({ name:'', start_date:'', end_date:'', description:'' })
  const submit = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${API}/periods`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    if(res.ok){ onCreated(); setForm({ name:'', start_date:'', end_date:'', description:'' }) }
  }
  return (
    <form onSubmit={submit} className="space-y-3 bg-white/70 border border-sky-100 rounded-xl p-4">
      <h3 className="font-semibold text-sky-900">Buat Periode PKL</h3>
      <input placeholder="Nama Periode" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200"/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
        <input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} className="px-3 py-2 rounded border border-sky-200"/>
      </div>
      <textarea placeholder="Deskripsi" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200"/>
      <button className="px-4 py-2 rounded bg-sky-500 text-white">Simpan</button>
    </form>
  )
}

export function QuickLists(){
  const [companies, setCompanies] = useState([])
  const [periods, setPeriods] = useState([])
  const load = async ()=>{
    setCompanies(await fetch(`${API}/companies`).then(r=>r.json()))
    setPeriods(await fetch(`${API}/periods`).then(r=>r.json()))
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white/70 border border-sky-100 rounded-xl p-4">
        <h3 className="font-semibold text-sky-900 mb-2">Daftar Perusahaan</h3>
        <ul className="space-y-2 max-h-60 overflow-auto">
          {companies.map(c=> (
            <li key={c._id} className="p-2 rounded border border-sky-100 flex justify-between items-center">
              <div>
                <div className="font-medium text-sky-900">{c.name}</div>
                <div className="text-sm text-sky-700">{c.city} • Kuota {c.quota}</div>
              </div>
              <span className="text-xs text-sky-600">{(c.positions||[]).join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white/70 border border-sky-100 rounded-xl p-4">
        <h3 className="font-semibold text-sky-900 mb-2">Periode PKL</h3>
        <ul className="space-y-2 max-h-60 overflow-auto">
          {periods.map(p=> (
            <li key={p._id} className="p-2 rounded border border-sky-100">
              <div className="font-medium text-sky-900">{p.name}</div>
              <div className="text-sm text-sky-700">{p.start_date} → {p.end_date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
