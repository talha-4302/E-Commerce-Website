import React, { useContext, } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Filter from '../components/Filter.jsx'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'


const WishList = () => {
  const { wishlistItems, currency, filterWishlist, removeFromWishlist, addToWishlist, addToCart, mobileFilterVisible, setMobileFilterVisible, getProductById } = useContext(ShopContext)


  const filteredWishlist = filterWishlist()

  

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success('Added to cart')
    removeFromWishlist(product._id)
  }

  const handleRemove = (productId) => {
    removeFromWishlist(productId)
  }

  const handleToggleFilter = () => {
    setMobileFilterVisible(prev => !prev)
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-1 lg:gap-10 ${mobileFilterVisible ? 'overflow-hidden fixed w-full h-full lg:h-auto lg:w-auto lg:static z-40 bg-white' : ''} relative`}>

      <Filter />

      <div className='flex-1 w-full p-4 lg:p-6'>
        

        {/* Title */}
        <div className='inline-flex gap-2 items-center mb-8 lg:mb-10'>
          <p className='text-3xl text-gray-500'>Your <span className='text-gray-700 font-medium'>Wishlist</span></p>
          <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
        </div>

        {/* Mobile filter toggle */}
        <div className='flex justify-end lg:hidden mb-4'>
          <button
            type='button'
            onClick={handleToggleFilter}
            className='inline-flex items-center justify-center rounded border border-gray-300 bg-white p-2 hover:bg-gray-100'
          >
            <img src={assets.filter_icon} alt='Filter' className='w-5 h-5' />
          </button>
        </div>

        {/* Wishlist Items */}
        {filteredWishlist.length === 0 ? (
          <div className='text-center py-20 text-gray-500'>
            <p className='text-xl'>Your wishlist is empty.</p>
            <p className='mt-2 text-sm text-gray-400'>Browse our collection to find items you love.</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {filteredWishlist.map(item => (
              <div >
                <div key={item._id} className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 border border-gray-200 rounded-lg bg-white'>
                {/* Product Image */}
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className='w-full sm:w-32 sm:h-40 md:w-36 md:h-44 object-cover rounded-md'
                />

                {/* Product Details */}
                <div className='flex-1 min-w-0 flex flex-col justify-between'>
                  <div>
                    <Link to={`/product/${item._id}`}><p className='hover:underline font-semibold text-gray-900 text-lg truncate'>{item.name}</p></Link>
                    <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{item.description}</p>
                    <p className='text-xl font-medium text-gray-900 mt-3'>{currency}{item.price}</p>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-3 mt-4'>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className='bg-black text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors'
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className='flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded text-sm font-medium hover:bg-red-50 transition-colors'
                    >
                      <img src={assets.bin_icon} alt='Remove' className='w-4 h-4 opacity-70' />
                      {/* <span className='hidden sm:inline'>Remove</span> */}
                    </button>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishList
