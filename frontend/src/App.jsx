import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StoreRoutes from './routes/storeRoutes'
import AdminRoutes from './routes/adminRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const location = useLocation()
  // Hide store layout (Navbar/Footer) on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      <ToastContainer />

      {/* Admin Routes — standalone, no Navbar/Footer */}
      <AdminRoutes />

      {/* Store Routes — with Navbar, Footer */}
      {!isAdminPage && (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Navbar />
          <StoreRoutes />
          <Footer />
        </div>
      )}
    </>
  )
}

export default App
