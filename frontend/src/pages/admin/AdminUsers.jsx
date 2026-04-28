import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { adminGet, adminPut } from '../../utils/adminApi'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination.jsx'

const AdminUsers = () => {
  const { backendUrl, adminToken } = useContext(AuthContext)
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminGet(backendUrl, adminToken, `/api/admin/users?page=${currentPage}&limit=10`)
      if (data.success) {
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("User fetch error:", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (adminToken) {
      fetchUsers()
    }
  }, [adminToken, backendUrl, currentPage])

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active'
    const confirmMessage = newStatus === 'banned' 
      ? "Are you sure you want to BAN this user? They will no longer be able to log in."
      : "Are you sure you want to ACTIVATE this user?"
    
    if (!window.confirm(confirmMessage)) return

    try {
      const data = await adminPut(backendUrl, adminToken, `/api/admin/users/${userId}/status`, { account_status: newStatus })
      if (data.success) {
        toast.success(`User status updated to ${newStatus}`)
        fetchUsers() // Refresh list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Status toggle error:", error)
      toast.error("Failed to update user status")
    }
  }

  return (
    <div>
      <h1 className='text-2xl font-medium text-gray-800 mb-6'>Users</h1>

      <div className='bg-white border border-gray-200 rounded overflow-hidden shadow-sm'>
        {loading ? (
          <div className='p-10 text-center text-gray-400'>Loading users...</div>
        ) : users.length === 0 ? (
          <div className='p-10 text-center text-gray-400'>No users found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className='hidden md:block'>
              <table className='w-full text-base'>
                <thead>
                  <tr className='border-b border-gray-100 text-gray-500 text-left bg-gray-50/50'>
                    <th className='py-3 px-5 font-medium'>Name</th>
                    <th className='py-3 px-5 font-medium'>Email</th>
                    <th className='py-3 px-5 font-medium'>Joined</th>
                    <th className='py-3 px-5 font-medium'>Orders</th>
                    <th className='py-3 px-5 font-medium'>Status</th>
                    <th className='py-3 px-5 font-medium'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>
                      <td className='py-3 px-5'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold border border-gray-200'>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className='text-gray-800 font-medium'>{user.name}</span>
                        </div>
                      </td>
                      <td className='py-3 px-5 text-gray-600 text-sm'>{user.email}</td>
                      <td className='py-3 px-5 text-gray-500 text-sm'>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className='py-3 px-5 text-gray-600 text-center font-medium'>{user.order_count}</td>
                      <td className='py-3 px-5'>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${
                          user.account_status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.account_status}
                        </span>
                      </td>
                      <td className='py-3 px-5'>
                        <button
                          onClick={() => toggleUserStatus(user.id, user.account_status)}
                          className={`text-xs px-4 py-1.5 rounded-lg font-bold border transition-all ${
                            user.account_status === 'active'
                              ? 'text-red-500 border-red-100 hover:bg-red-500 hover:text-white'
                              : 'text-green-600 border-green-100 hover:bg-green-600 hover:text-white'
                          }`}
                        >
                          {user.account_status === 'active' ? 'BAN' : 'ACTIVATE'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='md:hidden space-y-3 p-4 bg-gray-50/50'>
              {users.map(user => (
                <div key={user.id} className='border border-gray-100 rounded-xl p-4 bg-white shadow-sm'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-12 h-12 rounded-full bg-black flex items-center justify-center text-sm text-white font-bold'>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className='flex-1'>
                      <p className='text-base font-bold text-gray-800'>{user.name}</p>
                      <p className='text-xs text-gray-400'>{user.email}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tight ${
                      user.account_status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.account_status}
                    </span>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-2 mb-4 text-[11px] bg-gray-50 p-3 rounded-lg'>
                    <div className='text-gray-500'>Joined: <span className='text-gray-800 font-medium'>{new Date(user.created_at).toLocaleDateString()}</span></div>
                    <div className='text-gray-500 text-right'>Orders: <span className='text-gray-800 font-medium'>{user.order_count}</span></div>
                  </div>

                  <button
                    onClick={() => toggleUserStatus(user.id, user.account_status)}
                    className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all border ${
                      user.account_status === 'active'
                        ? 'bg-red-50 text-red-600 border-red-100 active:bg-red-500 active:text-white'
                        : 'bg-green-50 text-green-600 border-green-100 active:bg-green-600 active:text-white'
                    }`}
                  >
                    {user.account_status === 'active' ? 'BAN USER' : 'ACTIVATE USER'}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='border-t border-gray-100 bg-gray-50/30'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
