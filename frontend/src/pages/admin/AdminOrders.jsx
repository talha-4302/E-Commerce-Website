import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { adminGet, adminPut } from '../../utils/adminApi'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination.jsx'

const statusColors = {
  Pending: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-orange-100 text-orange-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

const AdminOrders = () => {
  const { backendUrl, adminToken } = useContext(AuthContext)
  
  const [filter, setFilter] = useState('All')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let path = `/api/admin/orders?page=${currentPage}&limit=10`
      if (filter !== 'All') {
        path += `&status=${filter}`
      }
      
      const data = await adminGet(backendUrl, adminToken, path)
      if (data.success) {
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Order fetch error:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  useEffect(() => {
    if (adminToken) {
      fetchOrders()
    }
  }, [filter, currentPage, adminToken, backendUrl])

  const updateStatus = async (id, newStatus) => {
    try {
      const data = await adminPut(backendUrl, adminToken, `/api/admin/orders/${id}/status`, { status: newStatus })
      if (data.success) {
        toast.success('Status updated successfully')
        fetchOrders() // Re-fetch to sync with server
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Status update error:", error)
      toast.error("Failed to update status")
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>Orders</h1>
        <div className='flex items-center gap-3'>
          <p className='text-sm text-gray-500 hidden sm:block'>Filter by status:</p>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className='border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white cursor-pointer'
          >
            <option value='All'>All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded overflow-hidden'>
        {loading ? (
          <div className='p-10 text-center text-gray-400'>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className='p-10 text-center text-gray-400'>No orders found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className='hidden md:block'>
              <table className='w-full text-base'>
                <thead>
                  <tr className='border-b border-gray-100 text-gray-500 text-left bg-gray-50/50'>
                    <th className='py-3 px-5 font-medium'>Order ID</th>
                    <th className='py-3 px-5 font-medium'>Customer</th>
                    <th className='py-3 px-5 font-medium'>Details</th>
                    <th className='py-3 px-5 font-medium'>Total</th>
                    <th className='py-3 px-5 font-medium'>Status</th>
                    <th className='py-3 px-5 font-medium'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>
                      <td className='py-3 px-5 font-medium text-gray-800'>#{order.id}</td>
                      <td className='py-3 px-5'>
                        <p className='text-gray-800 font-medium'>{order.customer_name}</p>
                        <p className='text-sm text-gray-400'>{order.customer_email}</p>
                      </td>
                      <td className='py-3 px-5'>
                        <div className='space-y-0.5'>
                          {order.items.map((item, idx) => (
                            <p key={idx} className='text-xs text-gray-600'>
                              {item.product_name} ({item.size}) x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className='py-3 px-5 font-medium text-gray-800'>${order.total_amount}</td>
                      <td className='py-3 px-5'>
                        <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='py-3 px-5'>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className='border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-gray-500 cursor-pointer bg-white'
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='md:hidden space-y-3 p-4'>
              {orders.map(order => (
                <div key={order.id} className='border border-gray-100 rounded p-4 bg-white shadow-sm'>
                  <div className='flex justify-between items-start mb-2'>
                    <p className='text-base font-medium text-gray-800'>#{order.id}</p>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className='mb-3'>
                    <p className='text-sm font-medium text-gray-800'>{order.customer_name}</p>
                    <p className='text-xs text-gray-400'>{order.customer_email}</p>
                  </div>
                  <div className='bg-gray-50 p-2 rounded mb-3'>
                     {order.items.map((item, idx) => (
                        <p key={idx} className='text-xs text-gray-600 mb-1 last:mb-0'>
                          {item.product_name} ({item.size}) x {item.quantity}
                        </p>
                      ))}
                  </div>
                  <div className='flex justify-between items-center mb-3'>
                    <span className='text-xs text-gray-400'>Total Amount:</span>
                    <span className='font-medium text-gray-800'>${order.total_amount}</span>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className='border border-gray-300 rounded px-3 py-2 text-sm w-full bg-white outline-none focus:border-gray-500'
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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

export default AdminOrders
