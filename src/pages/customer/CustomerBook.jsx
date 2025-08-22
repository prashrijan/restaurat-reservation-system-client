import React, { useState } from 'react'
import { getAvailability, createReservation } from '../../api.js'
import Alert from '../../components/Alert.jsx'
import Spinner from '../../components/Spinner.jsx'

const toIso = (local) => new Date(local).toISOString()

export default function CustomerBook(){
  const [form, setForm] = useState({ name:'', phone:'', email:'', people:2, start:'', end:'' })
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const onChange = (e) => setForm(f => ({...f, [e.target.name]: e.target.value }))

  const check = async (e) => {
    e?.preventDefault()
    setMsg(null)
    if (!form.start || !form.end) return setMsg({type:'warning', text:'Pick start & end'})
    setLoading(true)
    try{
      const data = await getAvailability({ start: toIso(form.start), end: toIso(form.end), people: form.people })
      setTables(data)
      if (data.length===0) setMsg({type:'info', text:'No tables available. Try a different time.'})
    }catch(err){
      console.error(err); setMsg({type:'danger', text:'Failed to fetch availability'})
    }finally{ setLoading(false) }
  }

  const book = async (table_id) => {
    setMsg(null)
    try{
      const payload = {
        reservation_start: toIso(form.start),
        reservation_end: toIso(form.end),
        table_id,
        status: 'CONFIRMED',
        no_of_people: Number(form.people),
        customer_data: {
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null
        }
      }
      await createReservation(payload)
      setMsg({type:'success', text:'Booked! Check My Bookings to see it.'})
    }catch(err){
      let text = 'Booking failed'
      if (err?.response?.data) text = typeof err.response.data==='string' ? err.response.data : JSON.stringify(err.response.data)
      setMsg({type:'danger', text})
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <form className="row g-3" onSubmit={check}>
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <input className="form-control" name="phone" value={form.phone} onChange={onChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Email (optional)</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">People</label>
            <input type="number" min="1" className="form-control" name="people" value={form.people} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start</label>
            <input type="datetime-local" className="form-control" name="start" value={form.start} onChange={onChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">End</label>
            <input type="datetime-local" className="form-control" name="end" value={form.end} onChange={onChange} />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-dark w-100" type="submit" disabled={loading}>{loading ? <Spinner/> : 'Check Availability'}</button>
          </div>
        </form>
      </div>

      {msg && <div className="col-12"><Alert variant={msg.type}>{msg.text}</Alert></div>}

      <div className="col-12">
        <div className="row g-3">
          {tables.map(t => (
            <div className="col-sm-6 col-md-4" key={t.table_id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Table {t.table_number}</h5>
                  <div className="text-muted mb-3">Seats: {t.table_size}</div>
                  <button className="btn btn-outline-dark mt-auto" onClick={()=>book(t.table_id)}>Book this table</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
