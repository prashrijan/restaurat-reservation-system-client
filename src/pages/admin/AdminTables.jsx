import React, { useEffect, useState } from 'react'
import { listTables, createTable, updateTable } from '../../api.js'

export default function AdminTables(){
  const [rows, setRows] = useState([])
  const [number, setNumber] = useState('')
  const [size, setSize] = useState(2)
  const [isAvail, setIsAvail] = useState(true)

  const load = async () => {
    try{ setRows(await listTables()) }catch(e){ console.error(e) }
  }
  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try{
      await createTable({ table_number: number, table_size: Number(size), is_available: Boolean(isAvail) })
      setNumber(''); setSize(2); setIsAvail(true); await load()
    }catch(e){ alert('Failed to create table') }
  }

  const toggle = async (t) => {
    try{ await updateTable(t.table_id, { is_available: !t.is_available }); await load() }catch(e){ alert('Update failed') }
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Add Table</h5>
            <form className="row g-3" onSubmit={submit}>
              <div className="col-sm-4"><label className="form-label">Table Number</label><input className="form-control" value={number} onChange={e=>setNumber(e.target.value)} required/></div>
              <div className="col-sm-4"><label className="form-label">Table Size</label><input type="number" min="1" className="form-control" value={size} onChange={e=>setSize(e.target.value)} /></div>
              <div className="col-sm-2"><label className="form-label">Available</label><select className="form-select" value={isAvail?'1':'0'} onChange={e=>setIsAvail(e.target.value==='1')}><option value="1">Yes</option><option value="0">No</option></select></div>
              <div className="col-sm-2 d-flex align-items-end"><button className="btn btn-dark w-100" type="submit">Create</button></div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Tables</h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead><tr><th>ID</th><th>Number</th><th>Size</th><th>Available</th><th></th></tr></thead>
                <tbody>
                  {rows.map(t => (
                    <tr key={t.table_id}>
                      <td>{t.table_id}</td>
                      <td>{t.table_number}</td>
                      <td>{t.table_size}</td>
                      <td><span className={`badge rounded-pill ${t.is_available ? 'text-bg-success' : 'text-bg-secondary'}`}>{t.is_available?'Yes':'No'}</span></td>
                      <td className="text-end"><button className="btn btn-outline-secondary btn-sm" onClick={()=>toggle(t)}>Toggle</button></td>
                    </tr>
                  ))}
                  {rows.length===0 && <tr><td colSpan="5" className="text-muted">No tables yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
