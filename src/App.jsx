import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <NavLink to="/" className="navbar-brand fw-semibold">RestoReserve</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="nav" className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><NavLink to="/" className="nav-link">Customer</NavLink></li>
              <li className="nav-item"><NavLink to="/admin" className="nav-link">Admin</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-white border-top py-3">
        <div className="container small text-muted">
          API: {import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}
        </div>
      </footer>
    </div>
  )
}
