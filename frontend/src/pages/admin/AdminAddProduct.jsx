import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { adminGet, adminPost, adminPut } from '../../utils/adminApi'
import { toast } from 'react-toastify'

const AdminAddProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { backendUrl, adminToken } = useContext(AuthContext)
  
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L', 'XL'],
    bestSeller: false,
    images: [''], // Array of URL strings, start with 1 field
  })
  
  const [loading, setLoading] = useState(false)

  // Fetch product data if in edit mode
  useEffect(() => {
    if (!isEdit || !adminToken) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await adminGet(backendUrl, '', `/api/product/single/${id}`)
        if (data.success) {
          const p = data.product
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            subCategory: p.sub_category,
            sizes: p.sizes || [],
            bestSeller: p.bestseller === 1,
            images: p.images.length > 0 ? p.images : [''],
          })
        } else {
          toast.error(data.message)
          navigate('/admin/products')
        }
      } catch (error) {
        console.error("Fetch product error:", error)
        toast.error("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isEdit, adminToken, backendUrl, navigate])

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

  const handleImageUrlChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData(prev => ({ ...prev, images: updatedImages }))
  }

  const addImageUrlField = () => {
    if (formData.images.length < 4) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
    } else {
      toast.info("Maximum 4 images allowed")
    }
  }

  const removeImageUrlField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    // Always keep at least one field
    setFormData(prev => ({ ...prev, images: updatedImages.length > 0 ? updatedImages : [''] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const cleanImages = formData.images.filter(url => url.trim() !== '')
    if (cleanImages.length === 0) {
      toast.error('Please provide at least one image URL')
      return
    }

    const payload = {
      ...formData,
      images: cleanImages,
    }

    try {
      setLoading(true)
      let data
      if (isEdit) {
        data = await adminPut(backendUrl, adminToken, `/api/admin/products/${id}`, payload)
      } else {
        data = await adminPost(backendUrl, adminToken, '/api/admin/products', payload)
      }

      if (data.success) {
        toast.success(isEdit ? 'Product updated successfully!' : 'Product added successfully!')
        navigate('/admin/products')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Submit product error:", error)
      toast.error("An error occurred while saving the product")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <div className='p-10 text-center text-gray-400'>Loading product details...</div>
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className='text-base text-gray-500 hover:text-gray-700 flex items-center gap-2'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className='bg-white border border-gray-200 rounded p-6 shadow-sm'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left - Form Fields */}
          <div className='flex-1 space-y-6'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Product Name *</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={onChangeHandler}
                placeholder='e.g. Men Classic Shirt'
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-black text-base transition-all'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Description *</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={onChangeHandler}
                placeholder='Provide detailed product information...'
                rows={4}
                className='w-full p-3 border border-gray-300 rounded outline-none focus:border-black text-base resize-none transition-all'
                required
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Price *</label>
                <div className='relative'>
                   <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>$</span>
                   <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={onChangeHandler}
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    className='w-full p-3 pl-8 border border-gray-300 rounded outline-none focus:border-black text-base transition-all'
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1.5 block'>Bestseller</label>
                <div className='flex gap-6 mt-3'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='bestSeller'
                      checked={formData.bestSeller === true}
                      onChange={() => setFormData(prev => ({ ...prev, bestSeller: true }))}
                      className='w-4 h-4 accent-black'
                    />
                    <span className='text-base text-gray-700'>Yes</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='bestSeller'
                      checked={formData.bestSeller === false}
                      onChange={() => setFormData(prev => ({ ...prev, bestSeller: false }))}
                      className='w-4 h-4 accent-black'
                    />
                    <span className='text-base text-gray-700'>No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>Category</label>
                <div className='flex flex-wrap gap-4'>
                  {['Men', 'Women', 'Kids'].map(cat => (
                    <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='category'
                        value={cat}
                        checked={formData.category === cat}
                        onChange={onChangeHandler}
                        className='w-4 h-4 accent-black'
                      />
                      <span className='text-base text-gray-700'>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>Sub Category</label>
                <div className='flex flex-wrap gap-4'>
                  {['Topwear', 'Bottomwear', 'Winterwear'].map(sub => (
                    <label key={sub} className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='subCategory'
                        value={sub}
                        checked={formData.subCategory === sub}
                        onChange={onChangeHandler}
                        className='w-4 h-4 accent-black'
                      />
                      <span className='text-base text-gray-700'>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>Available Sizes</label>
              <div className='flex flex-wrap gap-3'>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => handleSizeToggle(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border transition-all ${
                      formData.sizes.includes(size)
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Image URL Fields (Max 4) */}
          <div className='w-full lg:w-80'>
             <div className='bg-gray-50 border border-gray-200 rounded-lg p-5'>
                <h3 className='text-sm font-bold text-gray-800 mb-4'>Product Image URLs</h3>
                <p className='text-[10px] text-gray-400 mb-4 uppercase tracking-wider italic'>Maximum 4 image paths allowed</p>
                
                <div className='space-y-4'>
                   {formData.images.map((url, index) => (
                    <div key={index} className='relative group'>
                      <label className='text-[10px] text-gray-500 mb-1 block uppercase'>Image Path #{index + 1}</label>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder='/assets/men_shirt_1.jpg'
                          className='flex-1 p-2 border border-gray-300 rounded text-sm focus:border-black outline-none bg-white'
                        />
                        {formData.images.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeImageUrlField(index)}
                            className='w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-100'
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {url.trim() && (
                        <div className='mt-2 border border-gray-200 rounded bg-white overflow-hidden p-1'>
                           <img 
                              src={url} 
                              alt={`Preview ${index + 1}`} 
                              className='w-full aspect-square object-contain bg-gray-50' 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/200x200?text=Invalid+Path'
                              }}
                           />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {formData.images.length < 4 && (
                  <button
                    type='button'
                    onClick={addImageUrlField}
                    className='w-full mt-4 py-2.5 border-2 border-dashed border-gray-300 rounded text-xs font-bold text-gray-500 hover:border-black hover:text-black transition-all flex items-center justify-center gap-2'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    ADD ANOTHER IMAGE
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Submit */}
        <div className='mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4'>
          <button
            type='button'
            onClick={() => navigate('/admin/products')}
            className='px-8 py-3 border border-gray-300 rounded text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className={`px-8 py-3 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] uppercase tracking-wider ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminAddProduct
