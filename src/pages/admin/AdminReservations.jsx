import React, { useEffect, useState } from 'react'
import { listReservations, updateReservation, getAvailability } from '../../api.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import Alert from '../../components/Alert.jsx'

const toIso = (local) => new Date(local).toISOString()

export default function AdminReservations(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState({ phone:'', status:'', from:'', to:'' })
  const [msg, setMsg] = useState(null)

  const load = async () => {
    setMsg(null)
    try{
      const params = {}
      if (q.phone) params.customer_phone = q.phone
      if (q.status) params.status = q.status
      if (q.from) params.from = toIso(q.from)
      if (q.to) params.to = toIso(q.to)
      const data = await listReservations(params)
      setRows(data)
    }catch(e){ console.error(e); setMsg({type:'danger', text:'Failed to load'}) }
  }
  useEffect(()=>{ load() }, [])

  const cancel = async (id) => {
    try{ await updateReservation(id, { status:'CANCELLED' }); await load() }catch(e){ setMsg({type:'danger', text:'Cancel failed'}) }
  }

  // edit
  const [editing, setEditing] = useState(null)
  const [edit, setEdit] = useState({ people:2, start:'', end:'' })
  const [choices, setChoices] = useState([])

  const open = (r) => {
    setEditing(r.reservation_id)
    setEdit({ people:r.no_of_people, start:r.reservation_start.slice(0,16), end:r.reservation_end.slice(0,16) })
    setChoices([])
  }
  const check = async () => {
    try{
      const data = await getAvailability({ start: toIso(edit.start), end: toIso(edit.end), people: edit.people })
      setChoices(data)
      if (data.length===0) setMsg({type:'info', text:'No tables available for the new window.'})
    }catch(e){ setMsg({type:'danger', text:'Check failed'}) }
  }
  const save = async (table_id) => {
    try{
      await updateReservation(editing, {
        reservation_start: toIso(edit.start),
        reservation_end: toIso(edit.end),
        no_of_people: Number(edit.people),
        table_id
      })
      setEditing(null); setChoices([])
      await load()
    }catch(e){ setMsg({type:'danger', text:'Save failed'}) }
  }

  return (
    <div>
      <div className="row g-2 mb-3">
        <div className="col-sm-3"><input className="form-control" placeholder="Customer phone" value={q.phone} onChange={e=>setQ(v=>({...v, phone:e.target.value}))}/></div>
        <div className="col-sm-2">
          <select className="form-select" value={q.status} onChange={e=>setQ(v=>({...v, status:e.target.value}))}>
            <option value="">All</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="col-sm-2"><input type="datetime-local" className="form-control" value={q.from} onChange={e=>setQ(v=>({...v, from:e.target.value}))} /></div>
        <div className="col-sm-2"><input type="datetime-local" className="form-control" value={q.to} onChange={e=>setQ(v=>({...v, to:e.target.value}))} /></div>
        <div className="col-sm-3 d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={load}>Filter</button>
          <button className="btn btn-outline-secondary" onClick={()=>{ setQ({phone:'', status:'', from:'', to:''}); load(); }}>Reset</button>
        </div>
      </div>
      {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr><th>ID</th><th>Table</th><th>People</th><th>Start</th><th>End</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.reservation_id}>
                <td>{r.reservation_id}</td>
                <td>{r.table_id ?? r.table}</td>
                <td>{r.no_of_people}</td>
                <td>{new Date(r.reservation_start).toLocaleString()}</td>
                <td>{new Date(r.reservation_end).toLocaleString()}</td>
                <td><span className="me-2"><StatusBadge status={r.status}/></span></td>
                <td className="text-end">
                  {r.status!=='CANCELLED' && (
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>open(r)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>cancel(r.reservation_id)}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card mt-3">
          <div className="card-body">
            <h6 className="mb-3">Edit Reservation #{editing}</h6>
            <div className="row g-3">
              <div className="col-sm-3"><label className="form-label">People</label><input type="number" min="1" className="form-control" value={edit.people} onChange={e=>setEdit(v=>({...v, people:e.target.value}))} /></div>
              <div className="col-sm-4"><label className="form-label">Start</label><input type="datetime-local" className="form-control" value={edit.start} onChange={e=>setEdit(v=>({...v, start:e.target.value}))} /></div>
              <div className="col-sm-4"><label className="form-label">End</label><input type="datetime-local" className="form-control" value={edit.end} onChange={e=>setEdit(v=>({...v, end:e.target.value}))} /></div>
              <div className="col-sm-1 d-flex align-items-end"><button className="btn btn-outline-secondary w-100" onClick={check}>Check</button></div>
            </div>
            <div className="row g-3 mt-2">
              {choices.map(t => (
                <div className="col-md-4" key={t.table_id}>
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="fw-semibold">Table {t.table_number}</div>
                      <div className="text-muted mb-3">Seats: {t.table_size}</div>
                      <button className="btn btn-dark mt-auto" onClick={()=>save(t.table_id)}>Use this table</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
