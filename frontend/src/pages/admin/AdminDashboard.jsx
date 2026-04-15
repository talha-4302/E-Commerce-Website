import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../assets/assets'

// Dummy data (replace with backend API later)
const dummyOrderStatus = [
  { label: 'Placed', count: 320, width: '80%' },
  { label: 'Confirmed', count: 280, width: '70%' },
  { label: 'Shipped', count: 350, width: '88%' },
  { label: 'Delivered', count: 298, width: '75%' },
]

const dummyRecentOrders = [
  { id: '#1041', customer: 'Jane S.', amount: '$340', status: 'Delivered' },
  { id: '#1040', customer: 'Mike L.', amount: '$120', status: 'Shipped' },
  { id: '#1039', customer: 'Sara W.', amount: '$560', status: 'Placed' },
  { id: '#1038', customer: 'Tom B.', amount: '$210', status: 'Confirmed' },
  { id: '#1037', customer: 'Amy R.', amount: '$290', status: 'Delivered' },
]

const statusColors = {
  Placed: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-orange-100 text-orange-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
}

// Pick 6 bestseller products from existing data
const bestSellers = products
  .filter(p => p.bestSeller)
  .slice(0, 6)
  .map((p, i) => ({ ...p, sold: [142, 118, 96, 87, 74, 63][i] || 50 }))

const AdminDashboard = () => {
  return (
    <div>
      {/* Header */}
      <h1 className='text-2xl font-medium text-gray-800 mb-6'>Dashboard</h1>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <StatCard value='1,248' label='Orders' />
        <StatCard value='3,420' label='Users' />
        <StatCard value='52' label='Products' />
      </div>

      {/* Two Column Layout */}
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Column */}
        <div className='flex-1 space-y-6'>
          {/* Order Status */}
          <div className='bg-white border border-gray-200 rounded p-5'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>Order Status</h2>
            <div className='space-y-3'>
              {dummyOrderStatus.map(item => (
                <div key={item.label} className='flex items-center gap-3'>
                  <span className='text-base text-gray-600 w-24'>{item.label}</span>
                  <span className='text-base font-medium text-gray-800 w-10'>{item.count}</span>
                  <div className='flex-1 h-3 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gray-700 rounded-full'
                      style={{ width: item.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div className='bg-white border border-gray-200 rounded p-5'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>Best Sellers</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {bestSellers.map(product => (
                <div key={product._id} className='text-center'>
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className='w-full aspect-square object-cover rounded mb-2 border border-gray-100'
                  />
                  <p className='text-base text-gray-700 truncate'>{product.name}</p>
                  <p className='text-sm text-gray-400'>{product.sold} sold</p>
                </div>
              ))}
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
              {dummyRecentOrders.map(order => (
                <div key={order.id} className='flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0'>
                  <div>
                    <p className='text-base text-gray-800 font-medium'>{order.id}</p>
                    <p className='text-sm text-gray-400'>{order.customer}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-base text-gray-800'>{order.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ value, label }) => (
  <div className='bg-white border border-gray-200 rounded p-5 text-center'>
    <p className='text-3xl font-medium text-gray-800'>{value}</p>
    <p className='text-base text-gray-400 mt-1'>{label}</p>
  </div>
)

export default AdminDashboard
