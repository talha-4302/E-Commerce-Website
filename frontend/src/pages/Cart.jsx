import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext.js'
import { assets } from '../assets/assets'

const Cart = () => {
  const { cartItems, currency, delivery_fee, cartSubtotal, removeFromCart, updateCartItemQuantity } = useContext(ShopContext)
  const total = cartSubtotal + delivery_fee

  return (
    <div className='pt-8'>
      <div className='h-[1px] bg-gray-300 mb-8'></div>

        <div className ='inline-flex gap-2 items-center mb-20'>
            <p className='text-3xl text-gray-500'>Your <span className ='text-gray-700 font-medium'>Cart</span></p>
            <p className = 'w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
        </div>
      {cartItems.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          Your cart is empty.
        </div>
      ) : (
        <div className='space-y-8'>
          <div className='space-y-4'>
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className='flex flex-col gap-4 p-4 border border-gray-200 rounded md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-4 flex-1 min-w-0'>
                  <img src={item.image?.[0]} alt={item.name} className='w-20 h-20 object-cover rounded' />
                  <div className='min-w-0'>
                    <p className='font-medium text-gray-900 truncate'>{item.name}</p>
                    <div className='flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2'>
                      <span>{currency}{item.price}</span>
                      <span className='text-gray-300'>|</span>
                      <span>Size: {item.size || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => updateCartItemQuantity(item._id, item.size, item.quantity - 1)}
                    className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-100'
                  >
                    -
                  </button>
                  <span className='w-8 text-center text-gray-800'>{item.quantity}</span>
                  <button
                    onClick={() => updateCartItemQuantity(item._id, item.size, item.quantity + 1)}
                    className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-100'
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className='p-2 bg-gray-100 rounded hover:bg-gray-200'
                >
                  <img src={assets.bin_icon} alt='Remove' className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>

          <div className='flex justify-end'>
            <div className='w-full md:w-1/3 p-6 border border-gray-200 rounded bg-white'>
              <h2 className='text-xl font-semibold mb-6'>CART TOTALS</h2>
              <div className='space-y-4 text-sm text-gray-600'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>{currency}{cartSubtotal}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping fee</span>
                  <span>{currency}{delivery_fee}</span>
                </div>
                <div className='flex justify-between font-semibold text-gray-900'>
                  <span>Total</span>
                  <span>{currency}{total}</span>
                </div>
              </div>
              <button className='mt-6 ml-auto block bg-black text-white px-5 py-3 rounded hover:bg-gray-800'>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
