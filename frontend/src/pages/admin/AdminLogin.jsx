import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import Logo from '../../components/Logo'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { backendUrl, setAdminToken } = useContext(AuthContext)


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setAdminToken(response.data.token)
        localStorage.setItem('adminToken', response.data.token)
        toast.success("Welcome to Admin Dashboard")
        navigate('/admin/dashboard')
      } else {
        toast.error(response.data.message)
        setError(response.data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      setError(err.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Logo className='h-8 mx-auto mb-4' />
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
