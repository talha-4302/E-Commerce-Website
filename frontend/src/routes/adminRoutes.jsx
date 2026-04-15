import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminAddProduct from '../pages/admin/AdminAddProduct'
import AdminUsers from '../pages/admin/AdminUsers'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='orders' element={<AdminOrders />} />
        <Route path='products' element={<AdminProducts />} />
        <Route path='add-product' element={<AdminAddProduct />} />
        <Route path='edit-product/:id' element={<AdminAddProduct />} />
        <Route path='users' element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
