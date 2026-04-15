import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { products } from '../../assets/assets'
import { toast } from 'react-toastify'

const AdminAddProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const existingProduct = isEdit ? products.find(p => p._id === id) : null

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price || '',
    category: existingProduct?.category || 'Men',
    subCategory: existingProduct?.subCategory || 'Topwear',
    sizes: existingProduct?.sizes || ['S', 'M', 'L', 'XL'],
    bestSeller: existingProduct?.bestSeller || false,
    image: null,
  })

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate
    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    // In real app: send to backend API
    toast.success(isEdit ? 'Product updated!' : 'Product added!')
    navigate('/admin/products')
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className='text-base text-gray-500 hover:text-gray-700'
        >
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className='bg-white border border-gray-200 rounded p-6'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left - Form Fields */}
          <div className='flex-1 space-y-5'>
            <div>
              <label className='text-base text-gray-600 mb-1 block'>Product Name *</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={onChangeHandler}
                placeholder='e.g. Men Classic Shirt'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500 text-base'
                required
              />
            </div>

            <div>
              <label className='text-base text-gray-600 mb-1 block'>Description *</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={onChangeHandler}
                placeholder='Product description...'
                rows={3}
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500 text-base resize-none'
                required
              />
            </div>

            <div>
              <label className='text-base text-gray-600 mb-1 block'>Price *</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={onChangeHandler}
                placeholder='0.00'
                min='0'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-gray-500 text-base'
                required
              />
            </div>

            <div>
              <label className='text-base text-gray-600 mb-2 block'>Category</label>
              <div className='flex gap-4'>
                {['Men', 'Women', 'Kids'].map(cat => (
                  <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='category'
                      value={cat}
                      checked={formData.category === cat}
                      onChange={onChangeHandler}
                      className='w-4 h-4'
                    />
                    <span className='text-base text-gray-700'>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='text-base text-gray-600 mb-2 block'>Sub Category</label>
              <div className='flex gap-4'>
                {['Topwear', 'Bottomwear', 'Winterwear'].map(sub => (
                  <label key={sub} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='subCategory'
                      value={sub}
                      checked={formData.subCategory === sub}
                      onChange={onChangeHandler}
                      className='w-4 h-4'
                    />
                    <span className='text-base text-gray-700'>{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='text-base text-gray-600 mb-2 block'>Sizes</label>
              <div className='flex gap-3'>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 text-base rounded border transition-colors ${
                      formData.sizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-base text-gray-600 mb-2 block'>Bestseller</label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='bestSeller'
                    checked={formData.bestSeller === true}
                    onChange={() => setFormData(prev => ({ ...prev, bestSeller: true }))}
                    className='w-4 h-4'
                  />
                  <span className='text-base text-gray-700'>Yes</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='bestSeller'
                    checked={formData.bestSeller === false}
                    onChange={() => setFormData(prev => ({ ...prev, bestSeller: false }))}
                    className='w-4 h-4'
                  />
                  <span className='text-base text-gray-700'>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Image Upload */}
          <div className='w-full lg:w-72'>
            <label className='text-sm text-gray-600 mb-2 block'>Product Image</label>
            <div className='border-2 border-dashed border-gray-200 rounded p-4 text-center'>
              {formData.image ? (
                <div className='relative'>
                  <img src={formData.image} alt='Preview' className='w-full aspect-square object-cover rounded' />
                  <button
                    type='button'
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs leading-6'
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className='cursor-pointer block py-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-8 h-8 mx-auto text-gray-300 mb-2'>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className='text-sm text-gray-400'>Click to upload</p>
                  <p className='text-xs text-gray-300 mt-1'>PNG, JPG up to 5MB</p>
                  <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className='mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3'>
          <button
            type='button'
            onClick={() => navigate('/admin/products')}
            className='px-6 py-2.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-6 py-2.5 bg-black text-white rounded text-sm hover:bg-gray-800 transition-colors'
          >
            {isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminAddProduct
