import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children, right }){
  return (
    <section className="bg-white/70 border border-sky-100 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sky-900">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}

export function PlacementApply({ user }){
  const [companies, setCompanies] = useState([])
  const [periods, setPeriods] = useState([])
  const [form, setForm] = useState({ company_id:'', period_id:'', position:'' })
  const [myPlacements, setMyPlacements] = useState([])
  const load = async ()=>{
    const [c,p,l]= await Promise.all([
      fetch(`${API}/companies`).then(r=>r.json()),
      fetch(`${API}/periods`).then(r=>r.json()),
      fetch(`${API}/placements?student_id=${user.id}`).then(r=>r.json()),
    ])
    setCompanies(c)
    setPeriods(p)
    setMyPlacements(l)
  }
  useEffect(()=>{ load() },[])

  const selectedCompany = useMemo(()=> companies.find(c=>String(c._id)===form.company_id), [companies, form.company_id])

  const submit = async (e)=>{
    e.preventDefault()
    if(!form.company_id || !form.period_id) return
    const payload = {
      student_id: user.id,
      company_id: form.company_id,
      position: form.position || undefined,
      period_id: form.period_id,
      status: 'applied'
    }
    const res = await fetch(`${API}/placements`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if(res.ok){ setForm({ company_id:'', period_id:'', position:'' }); await load() }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section title="Ajukan Penempatan">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-sky-800 mb-1">Perusahaan</label>
            <select value={form.company_id} onChange={e=>setForm({...form, company_id:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200">
              <option value="">Pilih perusahaan</option>
              {companies.map(c=> (
                <option key={c._id} value={c._id}>{c.name} • Kuota {c.quota}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sky-800 mb-1">Posisi</label>
            <select value={form.position} onChange={e=>setForm({...form, position:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200">
              <option value="">Pilih posisi (opsional)</option>
              {(selectedCompany?.positions||[]).map(pos=> (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-sky-800 mb-1">Periode</label>
            <select value={form.period_id} onChange={e=>setForm({...form, period_id:e.target.value})} className="w-full px-3 py-2 rounded border border-sky-200">
              <option value="">Pilih periode</option>
              {periods.map(p=> (
                <option key={p._id} value={p._id}>{p.name} ({p.start_date}→{p.end_date})</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 rounded bg-sky-500 text-white">Ajukan</button>
        </form>
      </Section>

      <Section title="Pengajuan Saya">
        <ul className="divide-y divide-sky-100">
          {myPlacements.length===0 && (
            <li className="text-sky-700 text-sm">Belum ada pengajuan.</li>
          )}
          {myPlacements.map(p=>{
            const comp = companies.find(c=>String(c._id)===p.company_id)
            const per = periods.find(pp=>String(pp._id)===p.period_id)
            return (
              <li key={p._id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sky-900">{comp?.name || p.company_id}</div>
                  <div className="text-sm text-sky-700">{per?.name || p.period_id} • {p.position || '—'}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded capitalize ${p.status==='approved'?'bg-green-100 text-green-700':p.status==='rejected'?'bg-red-100 text-red-700':p.status==='review'?'bg-yellow-100 text-yellow-700':'bg-sky-100 text-sky-700'}`}>{p.status}</span>
              </li>
            )
          })}
        </ul>
      </Section>
    </div>
  )
}

export function PlacementManage(){
  const [placements, setPlacements] = useState([])
  const [companies, setCompanies] = useState([])
  const [periods, setPeriods] = useState([])
  const [filter, setFilter] = useState('all')

  const load = async ()=>{
    const [l,c,p] = await Promise.all([
      fetch(`${API}/placements`).then(r=>r.json()),
      fetch(`${API}/companies`).then(r=>r.json()),
      fetch(`${API}/periods`).then(r=>r.json()),
    ])
    setPlacements(l)
    setCompanies(c)
    setPeriods(p)
  }
  useEffect(()=>{ load() },[])

  const update = async (id, data)=>{
    await fetch(`${API}/placements/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    await load()
  }

  const filtered = useMemo(()=> placements.filter(p=> filter==='all' ? true : p.status===filter), [placements, filter])

  return (
    <Section title="Kelola Pengajuan Penempatan" right={
      <select value={filter} onChange={e=>setFilter(e.target.value)} className="px-2 py-1 rounded border border-sky-200 text-sm">
        <option value="all">Semua</option>
        <option value="applied">Applied</option>
        <option value="review">Review</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
    }>
      <div className="overflow-x-auto -mx-2 md:mx-0">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-sky-700">
              <th className="py-2 px-2">Mahasiswa</th>
              <th className="py-2 px-2">Perusahaan</th>
              <th className="py-2 px-2">Periode</th>
              <th className="py-2 px-2">Posisi</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Dosen</th>
              <th className="py-2 px-2">Pemb. Ind.</th>
              <th className="py-2 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {filtered.map(p=>{
              const comp = companies.find(c=>String(c._id)===p.company_id)
              const per = periods.find(pp=>String(pp._id)===p.period_id)
              return (
                <tr key={p._id} className="align-top">
                  <td className="py-2 px-2 max-w-[160px] truncate" title={p.student_id}>{p.student_id}</td>
                  <td className="py-2 px-2">{comp?.name || p.company_id}</td>
                  <td className="py-2 px-2">{per?.name || p.period_id}</td>
                  <td className="py-2 px-2">{p.position || '—'}</td>
                  <td className="py-2 px-2">
                    <select value={p.status} onChange={e=>update(p._id, { status:e.target.value })} className="px-2 py-1 rounded border border-sky-200">
                      {['applied','review','approved','rejected','ongoing','completed'].map(s=> <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input placeholder="ID dosen" value={p.supervisor_dosen_id||''} onChange={e=>update(p._id, { supervisor_dosen_id:e.target.value })} className="px-2 py-1 rounded border border-sky-200"/>
                  </td>
                  <td className="py-2 px-2">
                    <input placeholder="ID pemb. industri" value={p.supervisor_industri_id||''} onChange={e=>update(p._id, { supervisor_industri_id:e.target.value })} className="px-2 py-1 rounded border border-sky-200"/>
                  </td>
                  <td className="py-2 px-2">
                    <button onClick={()=>update(p._id, { status:'approved' })} className="px-2 py-1 rounded bg-green-500 text-white mr-2">Approve</button>
                    <button onClick={()=>update(p._id, { status:'rejected' })} className="px-2 py-1 rounded bg-red-500 text-white">Reject</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export default function Placements({ user }){
  return (
    <div className="space-y-4">
      {user.role === 'mahasiswa' && (
        <PlacementApply user={user} />
      )}
      {(user.role === 'admin' || user.role === 'koordinator') && (
        <PlacementManage />
      )}
    </div>
  )
}
