import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { adminGet } from '../../utils/adminApi'

const AdminDashboard = () => {
  const { backendUrl, adminToken } = useContext(AuthContext)
  
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalProducts: 0 })
  const [orderStatus, setOrderStatus] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await adminGet(backendUrl, adminToken, '/api/admin/dashboard')
        if (data.success) {
          setStats(data.stats)
          setOrderStatus(data.orderStatus)
          setRecentOrders(data.recentOrders)
          setBestSellers(data.bestSellers)
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (adminToken) {
      fetchDashboardData()
    }
  }, [backendUrl, adminToken])

  const statusColors = {
    Pending: 'bg-blue-100 text-blue-700',
    Confirmed: 'bg-orange-100 text-orange-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return <div className='flex justify-center items-center h-64'><p className='text-gray-500'>Loading dashboard...</p></div>
  }

  return (
    <div>
      {/* Header */}
      <h1 className='text-2xl font-medium text-gray-800 mb-6'>Dashboard</h1>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <StatCard value={stats.totalOrders} label='Orders' />
        <StatCard value={stats.totalUsers} label='Users' />
        <StatCard value={stats.totalProducts} label='Products' />
      </div>

      {/* Two Column Layout */}
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Column */}
        <div className='flex-1 space-y-6'>
          {/* Order Status */}
          <div className='bg-white border border-gray-200 rounded p-5'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>Order Status</h2>
            <div className='space-y-3'>
              {orderStatus.map(item => {
                const percentage = stats.totalOrders > 0 
                  ? Math.round((item.count / stats.totalOrders) * 100) 
                  : 0
                return (
                  <div key={item.status} className='flex items-center gap-3'>
                    <span className='text-base text-gray-600 w-24'>{item.status}</span>
                    <span className='text-base font-medium text-gray-800 w-20'>{item.count} ({percentage}%)</span>
                    <div className='flex-1 h-3 bg-gray-100 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-gray-700 rounded-full transition-all duration-500'
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Best Sellers — Leaderboard layout */}
          <div className='bg-white border border-gray-200 rounded p-5'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>Best Sellers</h2>
            <div className='space-y-4'>
              {bestSellers.map((product, index) => (
                <div key={product.id} className='flex items-center gap-4 py-2 border-b border-gray-50 last:border-0'>
                  <span className='text-lg font-medium text-gray-400 w-6'>#{index + 1}</span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-12 h-12 object-cover rounded border border-gray-100'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-base text-gray-800 font-medium truncate'>{product.name}</p>
                    <p className='text-sm text-gray-500'>${product.price}</p>
                  </div>
                  <div className='text-right'>
                     <span className='text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium'>Bestseller</span>
                  </div>
                </div>
              ))}
              {bestSellers.length === 0 && <p className='text-gray-400 text-center py-4'>No bestsellers found.</p>}
            </div>
          </div>
        </div>

        {/* Right Column — Recent Orders */}
        <div className='w-full lg:w-80'>
          <div className='bg-white border border-gray-200 rounded p-5'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium text-gray-800'>Recent Orders</h2>
              <Link to='/admin/orders' className='text-sm text-gray-400 hover:text-gray-600'>
                View All →
              </Link>
            </div>
            <div className='space-y-4'>
              {recentOrders.map(order => (
                <div key={order.id} className='flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0'>
                  <div className='min-w-0'>
                    <p className='text-base text-gray-800 font-medium'>#{order.id}</p>
                    <p className='text-sm text-gray-400 truncate'>{order.customer_name}</p>
                  </div>
                  <div className='text-right shrink-0 ml-2'>
                    <p className='text-base text-gray-800 font-medium'>${order.total_amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className='text-gray-400 text-center py-4'>No recent orders.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ value, label }) => (
  <div className='bg-white border border-gray-200 rounded p-5 text-center'>
    <p className='text-3xl font-medium text-gray-800'>{value.toLocaleString()}</p>
    <p className='text-base text-gray-400 mt-1'>{label}</p>
  </div>
)

export default AdminDashboard
