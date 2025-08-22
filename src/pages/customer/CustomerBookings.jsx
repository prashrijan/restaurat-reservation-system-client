import React, { useState } from 'react'
import { listReservations, updateReservation, getAvailability } from '../../api.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import Alert from '../../components/Alert.jsx'

const toIso = (local) => new Date(local).toISOString()

export default function CustomerBookings(){
  const [phone, setPhone] = useState('')
  const [rows, setRows] = useState([])
  const [msg, setMsg] = useState(null)

  const load = async () => {
    if (!phone) return setMsg({type:'warning', text:'Enter your phone to find bookings'})
    setMsg(null)
    try{
      const data = await listReservations({ customer_phone: phone })
      setRows(data)
      if (data.length===0) setMsg({type:'info', text:'No bookings found.'})
    }catch(e){ console.error(e); setMsg({type:'danger', text:'Failed to load'}) }
  }

  const cancel = async (id) => {
    try{
      await updateReservation(id, { status: 'CANCELLED' })
      await load()
    }catch(e){ console.error(e); setMsg({type:'danger', text:'Failed to cancel'}) }
  }

  // Edit state per row
  const [editing, setEditing] = useState(null)
  const [editValues, setEditValues] = useState({ people: 2, start:'', end:'' })
  const [choices, setChoices] = useState([])

  const openEdit = (r) => {
    setEditing(r.reservation_id)
    setEditValues({
      people: r.no_of_people,
      start: r.reservation_start.slice(0,16),
      end: r.reservation_end.slice(0,16)
    })
    setChoices([])
  }

  const checkNew = async () => {
    try{
      const data = await getAvailability({
        start: toIso(editValues.start),
        end: toIso(editValues.end),
        people: editValues.people
      })
      setChoices(data)
      if (data.length===0) setMsg({type:'info', text:'No tables available for the new window.'})
    }catch(e){ console.error(e); setMsg({type:'danger', text:'Failed to check availability'}) }
  }

  const saveEdit = async (table_id) => {
    try{
      await updateReservation(editing, {
        reservation_start: toIso(editValues.start),
        reservation_end: toIso(editValues.end),
        no_of_people: Number(editValues.people),
        table_id
      })
      setEditing(null); setChoices([])
      await load()
    }catch(e){
      console.error(e)
      setMsg({type:'danger', text: e?.response?.data ? JSON.stringify(e.response.data) : 'Failed to save changes'})
    }
  }

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Your phone (e.g., +614...)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={load}>Find</button>
      </div>
      {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Table</th><th>People</th><th>Start</th><th>End</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.reservation_id}>
                <td>{r.reservation_id}</td>
                <td>{r.table_id ?? r.table}</td>
                <td>{r.no_of_people}</td>
                <td>{new Date(r.reservation_start).toLocaleString()}</td>
                <td>{new Date(r.reservation_end).toLocaleString()}</td>
                <td><StatusBadge status={r.status}/></td>
                <td className="text-end">
                  {r.status!=='CANCELLED' && (
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>openEdit(r)}>Edit</button>
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
              <div className="col-sm-3">
                <label className="form-label">People</label>
                <input type="number" min="1" className="form-control" value={editValues.people} onChange={e=>setEditValues(v=>({...v, people:e.target.value}))}/>
              </div>
              <div className="col-sm-4">
                <label className="form-label">Start</label>
                <input type="datetime-local" className="form-control" value={editValues.start} onChange={e=>setEditValues(v=>({...v, start:e.target.value}))}/>
              </div>
              <div className="col-sm-4">
                <label className="form-label">End</label>
                <input type="datetime-local" className="form-control" value={editValues.end} onChange={e=>setEditValues(v=>({...v, end:e.target.value}))}/>
              </div>
              <div className="col-sm-1 d-flex align-items-end">
                <button className="btn btn-outline-secondary w-100" onClick={checkNew}>Check</button>
              </div>
            </div>

            <div className="row g-3 mt-2">
              {choices.map(t => (
                <div className="col-md-4" key={t.table_id}>
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="fw-semibold">Table {t.table_number}</div>
                      <div className="text-muted mb-3">Seats: {t.table_size}</div>
                      <button className="btn btn-dark mt-auto" onClick={()=>saveEdit(t.table_id)}>Use this table</button>
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
