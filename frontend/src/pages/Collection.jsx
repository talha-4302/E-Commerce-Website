import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import { assets } from '../assets/assets.js'
import Filter from '../components/Filter.jsx'

const Collection = () => {
  const { products, sortBy, setSortBy, mobileFilterVisible, setMobileFilterVisible } = useContext(ShopContext)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev)
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log('Search submitted:', searchInput)
  }

  const handleDropFilters = () => {
    setMobileFilterVisible(prev => !prev);
  }




  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-1 lg:gap-10 ${mobileFilterVisible ? 'overflow-hidden fixed w-full h-full lg:h-auto lg:w-auto lg:static z-40 bg-white' : ''} relative`}>

      <Filter />

      {/* Main Content */}
      <div className='flex-1 w-full p-4 lg:p-6'>



        {/* Header with Sort */}
        <div className='flex flex-col lg:flex-row gap-4 mb-6'>
          <div className='flex flex-wrap items-center justify-between gap-4 w-full'>
            <div className='inline-flex pt-2 gap-2 items-center flex-wrap'>
              <p className='text-gray-500 text-xl sm:text-2xl whitespace-nowrap'>ALL <span className='text-gray-700 font-medium'>Collections</span></p>
              <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
            </div>

            <button
              type='button'
              onClick={handleDropFilters}
              className='inline-flex items-center justify-center rounded border border-gray-300 bg-white p-2 hover:bg-gray-100 lg:hidden'
            >
              <img src={assets.filter_icon} alt='Filter' className='w-5 h-5' />
            </button>
          </div>

          <div className='flex flex-wrap items-center lg:justify-end gap-3'>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className='w-[160px] min-w-[160px] max-w-[200px] whitespace-normal border border-gray-300 px-4 py-2 rounded sm:flex-none'
            >
              <option value=''>Sort By</option>
              <option value='date'>Newest Arrivals</option>
            </select>
            <button
              type='button'
              onClick={handleSearchToggle}
              className='inline-flex items-center justify-center rounded border border-gray-300 bg-white p-2 hover:bg-gray-100'
            >
              <img src={assets.search_icon} alt='Search' className='w-5 h-5' />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className='mb-6'>
            <form onSubmit={handleSearchSubmit} className='mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row'>
              <input
                type='text'
                value={searchInput}
                onChange={handleSearchChange}
                placeholder='Search products...'
                className='flex-1 w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/10'
              />
              <button
                type='submit'
                className='w-full sm:w-auto rounded bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800'
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map(product => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.image[0]}
              bestseller={product.bestseller}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection
