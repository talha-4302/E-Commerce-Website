import React, { useContext, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import { assets } from '../assets/assets.js'
import Filter from '../components/Filter.jsx'

const Collection = () => {
  const { products, sortBy, setSortBy, mobileFilterVisible, setMobileFilterVisible } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    
    const query = searchQuery.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.subcategory?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

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
          </div>
        </div>

        {searchQuery && (
          <div className='mb-4'>
            <p className='text-sm text-gray-600'>
              Showing results for "<span className='font-medium text-gray-800'>{searchQuery}</span>"
              <span className='ml-2 text-gray-400'>({filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'})</span>
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredProducts.map(product => (
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
