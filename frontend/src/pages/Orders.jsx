import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext.js'

const Orders = () => {
  const { fetchOrders, currency } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrderData = async () => {
    setLoading(true) //*t kept for future: if need for re-fetching (e.g. user placed a new order & wants to see it immediately)
    const data = await fetchOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'Processing': return 'bg-blue-100 text-blue-700'
      case 'Shipped': return 'bg-purple-100 text-purple-700'
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-40'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black'></div>
      </div>
    )
  }

  return (
    <div className='pt-8'>
      <div className='h-[1px] bg-gray-300 mb-8'></div>

      <div className='inline-flex gap-2 items-center mb-8'>
        <p className='text-3xl text-gray-500'>Your <span className='text-gray-700 font-medium'>Orders</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          You have no orders yet.
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order.id} className='border border-gray-200 rounded-lg p-6 bg-white'>
              <div className='flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-100'>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-500'>Order Date</p>
                  <p className='font-medium'>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-500'>Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-500'>Payment Method</p>
                  <p className='font-medium uppercase'>{order.payment_method}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-500'>Total Amount</p>
                  <p className='font-bold text-lg'>{currency}{order.total_amount}</p>
                </div>
              </div>

              <div className='space-y-4'>
                <p className='text-sm font-medium text-gray-700'>Items</p>
                {order.items.map((item, index) => (
                  <div key={index} className='flex items-center gap-4 py-2'>
                    <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>{item.name}</p>
                      <p className='text-xs text-gray-500'>Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className='text-sm font-medium text-gray-900'>{currency}{item.price}</p>
                  </div>
                ))}
              </div>

              <div className='mt-6 pt-6 border-t border-gray-100'>
                <p className='text-sm text-gray-500 mb-1'>Shipping Address</p>
                <p className='text-sm text-gray-700'>{order.shipping_address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
