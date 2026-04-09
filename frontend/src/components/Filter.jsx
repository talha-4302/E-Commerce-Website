import {React,useContext} from 'react'
import { ShopContext } from '../context/ShopContext'

const Filter = () => {
    const { filters, setFilters, mobileFilterVisible, setMobileFilterVisible } = useContext(ShopContext);

    const visible = mobileFilterVisible;

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
     
      <div className={`${visible?'block absolute transition-all right-0 top-0   w-full h-full  overflow-y-auto':'hidden'}  sm:block sm:mt-25 w-1/5 bg-gray-50 p-6 h-1/2`}>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg font-semibold'>Filters</h2>
          <button onClick={() => setMobileFilterVisible(false)} className='text-xl sm:hidden font-bold'>×</button>
        </div>

        {/* Category */}
        <div className='mb-6'>
          <h3 className='font-medium mb-3'>Category</h3>
          {['Men', 'Women', 'Kids'].map(cat => (
            <label key={cat} className='flex items-center mb-2'>
              <input
                type='checkbox'
                checked={filters.category.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className='mr-2'
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Subcategory */}
        <div className='mb-6'>
          <h3 className='font-medium mb-3'>Subcategory</h3>
          {['Topwear', 'Bottomwear', 'Winterwear'].map(sub => (
            <label key={sub} className='flex items-center mb-2'>
              <input
                type='checkbox'
                checked={filters.subcategory.includes(sub)}
                onChange={() => handleSubcategoryChange(sub)}
                className='mr-2'
              />
              {sub}
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className='mb-6'>
          <h3 className='font-medium mb-3'>Price Range</h3>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm'>Min: ${filters.priceRange.min}</label>
              <input
                type='range'
                min='0'
                max='1000'
                value={filters.priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm'>Max: ${filters.priceRange.max}</label>
              <input
                type='range'
                min='0'
                max='1000'
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className='w-full'
              />
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default Filter
