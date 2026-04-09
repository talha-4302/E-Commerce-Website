import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import Title from '../components/Title'
import {assets} from '../assets/assets.js'
import Filter from '../components/Filter.jsx'

const Collection = () => {
  const { products,  sortBy, setSortBy, mobileFilterVisible, setMobileFilterVisible } = useContext(ShopContext)

  const handleDropFilters = () => {
    setMobileFilterVisible(prev => !prev);
  }


  

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
  }

  return (
    <div className={`flex ${mobileFilterVisible?'overflow-hidden':''} relative`}>

      <Filter vis={mobileFilterVisible}/>



      {/* Main Content */}
      <div className='flex-1 p-6'>

        

        {/* Header with Sort */}
          <div className='flex justify-between items-center mb-6'>
            
          
          <div className ='inline-flex pt-2 gap-2 items-center mb-3'>
            
            <div className='sm:hidden pr-2'>
              <img src={assets.filter_icon} alt='Filter' className='w-5 h-5 cursor-pointer' onClick={handleDropFilters} />
            </div>

            <p className='text-gray-500 text-lg sm:text-2xl'>ALL <span className ='text-gray-700 text-lg sm:text-2xl font-medium'>Collections</span></p>
            <p className = 'w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
          </div>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className='border border-gray-300 px-4 py-2 rounded'
          >
            <option value=''>Sort By</option>
            <option value='date'>Newest Arrivals</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
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
