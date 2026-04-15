import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../assets/assets'

const AdminProducts = () => {
  const [search, setSearch] = useState('')
  const [productList, setProductList] = useState(products)

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => {
    setProductList(prev => prev.filter(p => p._id !== id))
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-medium text-gray-800'>Products</h1>
        <div className='flex gap-3'>
          <input
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-500 w-48'
          />
          <Link
            to='/admin/add-product'
            className='bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors'
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded overflow-hidden'>
        {/* Desktop Table */}
        <div className='hidden md:block'>
          <table className='w-full text-base'>
            <thead>
              <tr className='border-b border-gray-100 text-gray-500 text-left'>
                <th className='py-3 px-5 font-medium'>Image</th>
                <th className='py-3 px-5 font-medium'>Name</th>
                <th className='py-3 px-5 font-medium'>Category</th>
                <th className='py-3 px-5 font-medium'>Price</th>
                <th className='py-3 px-5 font-medium'>Bestseller</th>
                <th className='py-3 px-5 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product._id} className='border-b border-gray-50 hover:bg-gray-50'>
                  <td className='py-3 px-5'>
                    <img src={product.image[0]} alt={product.name} className='w-12 h-12 object-cover rounded border border-gray-100' />
                  </td>
                  <td className='py-3 px-5'>
                    <p className='text-gray-800 font-medium truncate max-w-[200px]'>{product.name}</p>
                  </td>
                  <td className='py-3 px-5 text-gray-600'>
                    {product.category} / {product.subCategory}
                  </td>
                  <td className='py-3 px-5 font-medium text-gray-800'>${product.price}</td>
                  <td className='py-3 px-5'>
                    {product.bestSeller ? (
                      <span className='text-sm px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700'>Yes</span>
                    ) : (
                      <span className='text-sm text-gray-400'>—</span>
                    )}
                  </td>
                  <td className='py-3 px-5'>
                    <div className='flex gap-2'>
                      <Link to={`/admin/edit-product/${product._id}`} className='text-sm text-blue-600 hover:text-blue-800'>Edit</Link>
                      <button onClick={() => handleDelete(product._id)} className='text-sm text-red-500 hover:text-red-700'>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid */}
        <div className='md:hidden grid grid-cols-2 gap-3 p-4'>
          {filtered.map(product => (
            <div key={product._id} className='border border-gray-100 rounded p-3'>
              <img src={product.image[0]} alt={product.name} className='w-full aspect-square object-cover rounded mb-2' />
              <p className='text-base text-gray-800 truncate'>{product.name}</p>
              <p className='text-sm text-gray-400'>{product.category}</p>
              <p className='text-base font-medium text-gray-800 mt-1'>${product.price}</p>
              <div className='flex gap-2 mt-2'>
                <Link to={`/admin/edit-product/${product._id}`} className='text-sm text-blue-600'>Edit</Link>
                <button onClick={() => handleDelete(product._id)} className='text-sm text-red-500'>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
