import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'
import CustomerLayout from './pages/customer/CustomerLayout.jsx'
import CustomerBook from './pages/customer/CustomerBook.jsx'
import CustomerBookings from './pages/customer/CustomerBookings.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminReservations from './pages/admin/AdminReservations.jsx'
import AdminTables from './pages/admin/AdminTables.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<CustomerBook />} />
            <Route path="my-bookings" element={<CustomerBookings />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminReservations />} />
            <Route path="tables" element={<AdminTables />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
