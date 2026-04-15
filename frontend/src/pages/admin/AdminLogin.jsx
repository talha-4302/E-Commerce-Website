import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Hardcoded credentials — replace with backend auth later
    if (email === 'admin@ezshop.com' && password === 'admin123') {
      sessionStorage.setItem('adminLoggedIn', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <img src={assets.logo} className='w-28 mx-auto mb-4' alt='Logo' />
          <h1 className='text-2xl font-medium text-gray-800'>Admin Panel</h1>
          <p className='text-sm text-gray-400 mt-1'>Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className='bg-white border border-gray-200 rounded-lg p-8 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {error && (
              <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3 text-center'>{error}</p>
            )}

            <div>
              <label className='text-sm text-gray-600 mb-1 block'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@ezshop.com'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500 text-sm'
                required
              />
            </div>

            <div>
              <label className='text-sm text-gray-600 mb-1 block'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500 text-sm'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full bg-black text-white py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors'
            >
              LOGIN
            </button>
          </form>
        </div>

        <p className='text-center text-xs text-gray-400 mt-6'>
          Demo: admin@ezshop.com / admin123
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
