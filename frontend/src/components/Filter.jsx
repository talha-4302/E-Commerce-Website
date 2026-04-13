import {React,useContext} from 'react'
import { ShopContext } from '../context/ShopContext'

const Filter = () => {
    const { filters, setFilters, mobileFilterVisible, setMobileFilterVisible } = useContext(ShopContext);

    const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }))
  }

  const handleSubcategoryChange = (subcategory) => {
    setFilters(prev => ({
      ...prev,
      subcategory: prev.subcategory.includes(subcategory)
        ? prev.subcategory.filter(s => s !== subcategory)
        : [...prev.subcategory, subcategory]
    }))
  }

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: Number(value) }
    }))
  }
  
  
    return (
     
      <div className={`fixed top-0 left-0 h-full bg-white z-50 transition-all duration-300 overflow-hidden lg:static lg:block lg:mt-[37px] lg:w-1/5 lg:h-auto lg:bg-gray-50 lg:overflow-visible lg:p-6 ${mobileFilterVisible ? 'w-full' : 'w-0 lg:w-1/5'}`}>
        <div className={`flex flex-col w-screen lg:w-full min-w-[320px] lg:min-w-0 p-6 lg:p-0 h-full overflow-y-auto lg:overflow-visible transition-opacity duration-300 ${mobileFilterVisible ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl lg:text-lg font-semibold'>Filters</h2>
            <button onClick={() => setMobileFilterVisible(false)} className='text-3xl lg:hidden font-bold flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500'>×</button>
          </div>

          {/* Category */}
          <div className='mb-6'>
            <h3 className='font-medium mb-3 text-lg lg:text-base'>Category</h3>
            {['Men', 'Women', 'Kids'].map(cat => (
              <label key={cat} className='flex items-center mb-3 lg:mb-2 text-md lg:text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filters.category.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className='mr-3 w-4 h-4 rounded border-gray-300 accent-black'
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Subcategory */}
          <div className='mb-6'>
            <h3 className='font-medium mb-3 text-lg lg:text-base'>Subcategory</h3>
            {['Topwear', 'Bottomwear', 'Winterwear'].map(sub => (
              <label key={sub} className='flex items-center mb-3 lg:mb-2 text-md lg:text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filters.subcategory.includes(sub)}
                  onChange={() => handleSubcategoryChange(sub)}
                  className='mr-3 w-4 h-4 rounded border-gray-300 accent-black'
                />
                {sub}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className='mb-6 pb-20 lg:pb-0'>
            <h3 className='font-medium mb-3 text-lg lg:text-base'>Price Range</h3>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between items-center mb-1'>
                    <label className='block text-sm font-medium text-gray-700'>Min Price</label>
                    <span className='font-semibold text-gray-900'>${filters.priceRange.min}</span>
                </div>
                <input
                  type='range'
                  min='0'
                  max='1000'
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className='w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                />
              </div>
              <div className='pt-2'>
                <div className='flex justify-between items-center mb-1'>
                    <label className='block text-sm font-medium text-gray-700'>Max Price</label>
                    <span className='font-semibold text-gray-900'>${filters.priceRange.max}</span>
                </div>
                <input
                  type='range'
                  min='0'
                  max='1000'
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className='w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default Filter
