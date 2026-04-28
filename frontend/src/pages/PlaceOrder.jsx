import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.js'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { cartItems, currency, delivery_fee, cartSubtotal, placeOrder } = useContext(ShopContext)
  const navigate = useNavigate()

  const [method, setMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const total = cartSubtotal + delivery_fee

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate cart is not empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    //Validate form fields
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`,{
          autoClose:1500
        })
        return
      }
    }
    

    const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.street}, ${formData.city}, ${formData.state} ${formData.zipcode}, ${formData.country}. Phone: ${formData.phone}`
    
    const result = await placeOrder(shippingAddress, method, total)
    
    if (result.success) {
      toast.success('Order placed successfully!', {
        autoClose: 1500
      })
      navigate('/orders')
    } else {
      toast.error(result.message || 'Failed to place order')
    }
  }

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
        <button
          onClick={() => navigate('/cart')}
          className='bg-black text-white px-6 py-3 rounded hover:bg-gray-800'
        >
          Go to Cart
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='pt-8'>
      <div className='h-[1px] bg-gray-300 mb-8'></div>

      <div className='inline-flex gap-2 items-center mb-8'>
        <p className='text-3xl text-gray-500'>Checkout <span className='text-gray-700 font-medium'>Details</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Left Side - Shipping Information */}
        <div className='flex-1'>
          <h2 className='text-xl font-semibold mb-4'>Shipping Information</h2>

          <div className='space-y-4'>
            <div className='flex gap-4'>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={onChangeHandler}
                placeholder='First name'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={onChangeHandler}
                placeholder='Last name'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
            </div>

            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={onChangeHandler}
              placeholder='Email address'
              className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
            />

            <input
              type='text'
              name='street'
              value={formData.street}
              onChange={onChangeHandler}
              placeholder='Street address'
              className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
            />

            <div className='flex gap-4'>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={onChangeHandler}
                placeholder='City'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
              <input
                type='text'
                name='state'
                value={formData.state}
                onChange={onChangeHandler}
                placeholder='State'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
            </div>

            <div className='flex gap-4'>
              <input
                type='text'
                name='zipcode'
                value={formData.zipcode}
                onChange={onChangeHandler}
                placeholder='Zip code'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
              <input
                type='text'
                name='country'
                value={formData.country}
                onChange={onChangeHandler}
                placeholder='Country'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
              />
            </div>

            <input
              type='text'
              name='phone'
              value={formData.phone}
              onChange={onChangeHandler}
              placeholder='Phone number'
              className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500'
            />
          </div>
        </div>

        {/* Right Side - Order Summary & Payment */}
        <div className='w-full lg:w-96'>
          {/* Order Summary */}
          <div className='p-6 border border-gray-200 rounded bg-white mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

            <div className='space-y-3 mb-4 max-h-48 overflow-y-auto'>
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.size}`} className='flex items-center gap-3'>
                  <img src={item.image?.[0]} alt={item.name} className='w-12 h-12 object-cover rounded' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-800 truncate'>{item.name}</p>
                    <p className='text-xs text-gray-500'>Qty: {item.quantity} | Size: {item.size || '-'}</p>
                  </div>
                  <p className='text-sm text-gray-800'>{currency}{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className='space-y-2 text-sm text-gray-600 border-t pt-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>{currency}{cartSubtotal}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping fee</span>
                <span>{currency}{delivery_fee}</span>
              </div>
              <div className='flex justify-between font-semibold text-gray-900 text-base border-t pt-2'>
                <span>Total</span>
                <span>{currency}{total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className='p-6 border border-gray-200 rounded bg-white mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>

            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='cod'
                  checked={method === 'cod'}
                  onChange={() => setMethod('cod')}
                  className='w-4 h-4'
                />
                <span className='text-gray-700'>Cash on Delivery</span>
              </label>

              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='stripe'
                  checked={method === 'stripe'}
                  onChange={() => setMethod('stripe')}
                  className='w-4 h-4'
                />
                <span className='text-gray-700'>Stripe (Credit/Debit Card)</span>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type='submit'
            className='w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors'
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
