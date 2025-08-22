import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout(){
  return (
    <div className="card">
      <div className="card-body">
        <ul className="nav nav-pills mb-3">
          <li className="nav-item"><NavLink end to="/admin" className="nav-link">Reservations</NavLink></li>
          <li className="nav-item"><NavLink to="/admin/tables" className="nav-link">Tables</NavLink></li>
        </ul>
        <Outlet />
      </div>
    </div>
  )
}
