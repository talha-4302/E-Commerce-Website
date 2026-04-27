import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { adminGet, adminDelete } from '../../utils/adminApi'
import useDebounce from '../../hooks/useDebounce'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination.jsx'

const AdminProducts = () => {
  const { backendUrl, adminToken } = useContext(AuthContext)
  
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  
  const debouncedSearch = useDebounce(search, 300)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 10)
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }
      
      const data = await adminGet(backendUrl, '', `/api/product/list?${params.toString()}`)
      
      if (data.success) {
        const normalized = data.products.map(p => ({
          ...p,
          _id: p.id,
          image: p.image ? [p.image] : []
        }))
        setProducts(normalized)
        setPagination(data.pagination)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Product fetch error:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, currentPage, backendUrl])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return
    
    try {
      const data = await adminDelete(backendUrl, adminToken, `/api/admin/products/${id}`)
      if (data.success) {
        toast.success("Product deleted successfully")
        fetchProducts() // Re-fetch list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Delete product error:", error)
      toast.error("Failed to delete product")
    }
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>Products</h1>
        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
          <div className='relative flex-1 sm:w-64'>
            <input
              type='text'
              placeholder='Search by name or category...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full border border-gray-300 rounded px-10 py-2 text-sm outline-none focus:border-gray-500 transition-all'
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <Link
            to='/admin/add-product'
            className='bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors text-center'
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded overflow-hidden'>
        {loading ? (
          <div className='p-10 text-center text-gray-400'>Loading products...</div>
        ) : products.length === 0 ? (
          <div className='p-10 text-center text-gray-400'>
            {search ? `No products found matching "${search}"` : "No products available."}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className='hidden md:block'>
              <table className='w-full text-base'>
                <thead>
                  <tr className='border-b border-gray-100 text-gray-500 text-left bg-gray-50/50'>
                    <th className='py-3 px-5 font-medium'>Image</th>
                    <th className='py-3 px-5 font-medium'>Name</th>
                    <th className='py-3 px-5 font-medium'>Category</th>
                    <th className='py-3 px-5 font-medium'>Price</th>
                    <th className='py-3 px-5 font-medium'>Bestseller</th>
                    <th className='py-3 px-5 font-medium'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>
                      <td className='py-3 px-5'>
                        <img src={product.image[0]} alt={product.name} className='w-12 h-12 object-cover rounded border border-gray-100 bg-gray-50' />
                      </td>
                      <td className='py-3 px-5'>
                        <p className='text-gray-800 font-medium truncate max-w-[250px]'>{product.name}</p>
                        <p className='text-[10px] text-gray-400 uppercase tracking-tighter'>ID: {product._id}</p>
                      </td>
                      <td className='py-3 px-5'>
                        <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md'>
                          {product.category} / {product.sub_category}
                        </span>
                      </td>
                      <td className='py-3 px-5 font-medium text-gray-800'>${product.price}</td>
                      <td className='py-3 px-5'>
                        {product.bestseller ? (
                          <span className='text-[10px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold uppercase'>Yes</span>
                        ) : (
                          <span className='text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-400 font-bold uppercase'>No</span>
                        )}
                      </td>
                      <td className='py-3 px-5'>
                        <div className='flex gap-4'>
                          <Link to={`/admin/edit-product/${product._id}`} className='text-sm text-blue-600 hover:text-blue-800 font-medium'>Edit</Link>
                          <button onClick={() => handleDelete(product._id)} className='text-sm text-red-500 hover:text-red-700 font-medium'>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Grid */}
            <div className='md:hidden grid grid-cols-2 gap-4 p-4'>
              {products.map(product => (
                <div key={product._id} className='border border-gray-100 rounded p-3 bg-white shadow-sm flex flex-col'>
                  <div className='relative'>
                    <img src={product.image[0]} alt={product.name} className='w-full aspect-square object-cover rounded mb-2 bg-gray-50' />
                    {product.bestseller === 1 && (
                      <span className='absolute top-1 right-1 bg-yellow-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm'>BEST</span>
                    )}
                  </div>
                  <p className='text-sm text-gray-800 font-medium truncate'>{product.name}</p>
                  <p className='text-[10px] text-gray-400 mb-1'>{product.category}</p>
                  <p className='text-sm font-bold text-gray-900 mt-auto'>${product.price}</p>
                  <div className='flex justify-between mt-3 pt-3 border-t border-gray-50'>
                    <Link to={`/admin/edit-product/${product._id}`} className='text-xs text-blue-600 font-medium uppercase'>Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className='text-xs text-red-500 font-medium uppercase'>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='border-t border-gray-100 bg-gray-50/30'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
