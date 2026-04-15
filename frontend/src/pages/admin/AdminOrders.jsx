import React, { useState } from 'react'

// Dummy data (replace with backend API later)
const dummyOrders = [
  { id: '#1041', customer: 'Jane Smith', email: 'jane@email.com', items: 3, total: 340, status: 'Delivered', date: '2025-04-12' },
  { id: '#1040', customer: 'Mike Lee', email: 'mike@email.com', items: 1, total: 120, status: 'Shipped', date: '2025-04-11' },
  { id: '#1039', customer: 'Sara Wilson', email: 'sara@email.com', items: 4, total: 560, status: 'Placed', date: '2025-04-10' },
  { id: '#1038', customer: 'Tom Brown', email: 'tom@email.com', items: 2, total: 210, status: 'Confirmed', date: '2025-04-09' },
  { id: '#1037', customer: 'Amy Roberts', email: 'amy@email.com', items: 1, total: 290, status: 'Delivered', date: '2025-04-08' },
  { id: '#1036', customer: 'Dan White', email: 'dan@email.com', items: 2, total: 180, status: 'Shipped', date: '2025-04-07' },
  { id: '#1035', customer: 'Lisa Chen', email: 'lisa@email.com', items: 3, total: 450, status: 'Placed', date: '2025-04-06' },
  { id: '#1034', customer: 'James Hall', email: 'james@email.com', items: 1, total: 150, status: 'Delivered', date: '2025-04-05' },
]

const statusColors = {
  Placed: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-orange-100 text-orange-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const statuses = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

const AdminOrders = () => {
  const [filter, setFilter] = useState('All')
  const [orders, setOrders] = useState(dummyOrders)

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>Orders</h1>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white'
        >
          <option>All</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className='bg-white border border-gray-200 rounded overflow-hidden'>
        {/* Desktop Table */}
        <div className='hidden md:block'>
          <table className='w-full text-base'>
            <thead>
              <tr className='border-b border-gray-100 text-gray-500 text-left'>
                <th className='py-3 px-5 font-medium'>Order ID</th>
                <th className='py-3 px-5 font-medium'>Customer</th>
                <th className='py-3 px-5 font-medium'>Items</th>
                <th className='py-3 px-5 font-medium'>Total</th>
                <th className='py-3 px-5 font-medium'>Status</th>
                <th className='py-3 px-5 font-medium'>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className='border-b border-gray-50 hover:bg-gray-50'>
                  <td className='py-3 px-5 font-medium text-gray-800'>{order.id}</td>
                  <td className='py-3 px-5'>
                    <p className='text-gray-800'>{order.customer}</p>
                    <p className='text-sm text-gray-400'>{order.email}</p>
                  </td>
                  <td className='py-3 px-5 text-gray-600'>{order.items}</td>
                  <td className='py-3 px-5 font-medium text-gray-800'>${order.total}</td>
                  <td className='py-3 px-5'>
                    <span className={`text-sm px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className='py-3 px-5'>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className='border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-gray-500'
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
          {filtered.map(order => (
            <div key={order.id} className='border border-gray-100 rounded p-4'>
              <div className='flex justify-between items-start mb-2'>
                <p className='text-base font-medium text-gray-800'>{order.id}</p>
                <span className={`text-sm px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className='text-base text-gray-600 mb-1'>{order.customer}</p>
              <div className='flex justify-between text-base text-gray-400'>
                <span>{order.items} items</span>
                <span className='font-medium text-gray-800'>${order.total}</span>
              </div>
              <select
                value={order.status}
                onChange={e => updateStatus(order.id, e.target.value)}
                className='mt-2 border border-gray-300 rounded px-2 py-1 text-sm w-full'
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
