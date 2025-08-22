import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function CustomerLayout(){
  return (
    <div className="card">
      <div className="card-body">
        <ul className="nav nav-pills mb-3">
          <li className="nav-item"><NavLink end to="/" className="nav-link">Book</NavLink></li>
          <li className="nav-item"><NavLink to="/my-bookings" className="nav-link">My Bookings</NavLink></li>
        </ul>
        <Outlet />
      </div>
    </div>
  )
}
