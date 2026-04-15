import React, { useState } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useEffect } from 'react'

const AdminLayout = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check auth on mount
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true'
  useEffect(()=>{
    if (!isLoggedIn) {
        navigate('/admin/login');

      }
  },[navigate,isLoggedIn])


  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    navigate('/admin/login')
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Orders', path: '/admin/orders', icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0' },
    { label: 'Products', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Add Product', path: '/admin/add-product', icon: 'M12 4v16m8-8H4' },
    { label: 'Users', path: '/admin/users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md border border-gray-200`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-5 h-5'>
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className=' lg:hidden fixed inset-0 bg-gray bg-opacity-50 z-30'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-56 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className='p-5 border-b border-gray-100 pt-16 lg:pt-5'>
          <img src={assets.logo} className='w-24' alt='Logo' />
          <p className='text-sm text-gray-400 mt-1 tracking-wider'>ADMIN PANEL</p>
        </div>

        {/* Nav Links */}
        <nav className='flex-1 py-3'>
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path !== '/admin/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-[3px] ${
                  isActive
                    ? 'border-black bg-gray-50 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                <path d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className='p-3 border-t border-gray-100'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-5 py-2.5 text-md text-red-500 hover:bg-red-50 rounded transition-colors'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 ml-0  lg:ml-56 p-4 lg:p-8 pt-16 lg:pt-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
