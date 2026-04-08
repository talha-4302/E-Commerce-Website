import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import Title from '../components/Title'

const Collection = () => {
  const { products, filters, setFilters, sortBy, setSortBy } = useContext(ShopContext)
  const [sortText, setSortText] = useState('Sort By')

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

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    setSortText(value === 'date' ? 'Newest Arrivals' : 'Sort By')
  }

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className='w-1/5 bg-gray-50 p-6 min-h-screen'>
        <h2 className='text-lg font-semibold mb-6'>Filters</h2>

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

      {/* Main Content */}
      <div className='flex-1 p-6'>
        {/* Header with Sort */}
        <div className='flex justify-between items-center mb-6'>
          <Title text1='All' text2='Collections' />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className='border border-gray-300 px-4 py-2 rounded'
          >
            <option value=''>{sortText}</option>
            <option value='date'>Newest Arrivals</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-4 gap-6'>
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
