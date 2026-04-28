import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.js'
import { assets } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext.jsx'

const Product = () => {
  const { productid } = useParams()
  const { isUserVerified } = useContext(AuthContext)
  const { currency, addToCart, addToWishlist, isInWishlist, backendUrl } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeTab, setActiveTab] = useState('shipping')

  // ---------------------------------------------------------------
  // Data Fetching: Freshness over Speed (Choice 2)
  //
  // Pattern: Resource Fetching
  // We fetch the full product object (images, sizes, etc.) 
  // directly from the source of truth (/api/product/single/:id).
  // ---------------------------------------------------------------
  const fetchProductData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/product/single/${productid}`)
      if (response.data.success) {
        const p = response.data.product
        // Normalize: backend uses id, image array is 'images'
        const normalizedProduct = {
          ...p,
          _id: p.id,
          image: p.images || []
        }
        setProduct(normalizedProduct)

        // Fetch related products (using the same category)
        const relatedResponse = await axios.get(`${backendUrl}/api/product/list?category=${p.category}`)
        if (relatedResponse.data.success) {
          const related = relatedResponse.data.products
            .filter(item => item.id !== p.id)
            .slice(0, 4)
            .map(item => ({
              ...item,
              _id: item.id,
              image: item.image ? [item.image] : []
            }))
          setRelatedProducts(related)
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error)
      toast.error("Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProductData()
  }, [productid])


  const handleAddToCart = () => {
    if (isUserVerified) {
      if (!product) return;
      const sizeToAdd = selectedSize || product.sizes?.[0] || null;
      addToCart(product, sizeToAdd, 1);
    }
    else {
      toast.error("Please log in first")
    }

  }

  const handleAddToWishlist = () => {
    if (!isUserVerified) {
      toast.error("Please log in first")
      return;
    }
    if (!product) return;
    if (isInWishlist(product._id)) {
      toast.info('Already in wishlist', {
        autoClose: 1500,
      });
      return;
    }
    addToWishlist(product);
  }



  if (loading) {
    return (
      <div className='flex justify-center items-center py-40'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black'></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-500 text-lg'>Product not found</p>
      </div>
    )
  }

  return (
    <div className='  transition-opacity ease-in duration-500 opacity-100'>
      {/* Gray separator line */}
      <div className='h-[1px] bg-gray-300 mb-8'></div>

      {/* Product Display Section */}
      <div className='pt-10 flex flex-col sm:flex-row gap-8 mb-8'>
        {/* Left Side - Product Images */}
        <div className='flex-1 flex flex-col-reverse sm:flex-row gap-4'>
          {/* Thumbnails */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-visible w-full sm:w-auto gap-2 thumbnail-scrollbar'>
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product ${index + 1}`}
                className={`w-[20%] sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 object-cover rounded cursor-pointer border-2 ${selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1'>
            <img
              src={product.image[selectedImage] || product.image[0]}
              alt={product.name}
              className='w-full h-[80%] object-cover rounded'
            />
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className='flex-1'>
          {/* Product Title */}
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4'>
            {product.name}
          </h1>

          {/* Category Badge */}
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full'>
              {product.category}
            </span>
            <span className='text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full'>
              {product.sub_category}
            </span>
          </div>

          {/* Price */}
          <p className='text-2xl font-semibold text-gray-900 mb-4'>
            {currency}{product.price}
          </p>

          {/* Description */}
          <p className='text-sm text-gray-600 leading-relaxed mb-6'>
            {product.description}
          </p>

          {/* Size Selector */}
          <div className='mb-6'>
            <p className='text-sm font-medium text-gray-700 mb-3'>Select Size</p>
            <div className='flex gap-3'>
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} className='w-full md:w-2/5 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors'>
            ADD TO CART
          </button>

          {/* Add to Wishlist Button */}
          <button onClick={handleAddToWishlist} className={`w-full md:w-2/5 md:ml-3 py-3 rounded border transition-colors mt-3 ${isInWishlist(product._id) ? 'border-black bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400 text-gray-700'}`}>
            {isInWishlist(product._id) ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
          </button>

          {/* Gray divider line */}
          <div className='mt-3 md:w-4/5 h-[1px] bg-gray-300 mb-4'></div>

          {/* Product Characteristics */}
          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>✓ 100% Original Product</p>
            <p className='text-sm text-gray-600'>✓ Cash on Delivery Available</p>
            <p className='text-sm text-gray-600'>✓ Easy Return & Exchange Policy</p>
          </div>
        </div>
      </div>

      {/* Product Info Tabs */}
      <div className='mb-16'>
        {/* Tab Headers */}
        <div className='flex border-b border-gray-200'>
          {[
            { key: 'shipping', label: 'Shipping & Returns' },
            { key: 'care', label: 'Care Instructions' },
            { key: 'materials', label: 'Materials & Fabric' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === tab.key
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='py-6 text-sm text-gray-600 leading-relaxed'>
          {activeTab === 'shipping' && (
            <div className='space-y-3'>
              <p>We offer free standard shipping on all orders over $50.</p>
              <div className='space-y-2'>
                <p><span className='font-medium text-gray-800'>Standard Delivery:</span> 5–7 business days</p>
                <p><span className='font-medium text-gray-800'>Express Delivery:</span> 2–3 business days</p>
              </div>
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <p className='font-medium text-gray-800 mb-2'>Return Policy</p>
                <p>Returns are accepted within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Refunds are processed within 5–7 business days of receiving the returned item.</p>
              </div>
            </div>
          )}
          {activeTab === 'care' && (
            <div className='space-y-3'>
              <p className='font-medium text-gray-800'>Washing</p>
              <ul className='list-disc list-inside space-y-1 text-gray-600'>
                <li>Machine wash cold with similar colors</li>
                <li>Use a gentle cycle for delicate fabrics</li>
                <li>Do not bleach</li>
              </ul>
              <p className='font-medium text-gray-800 mt-4'>Drying & Ironing</p>
              <ul className='list-disc list-inside space-y-1 text-gray-600'>
                <li>Tumble dry on low heat</li>
                <li>Iron on low temperature if needed</li>
                <li>Do not dry clean</li>
              </ul>
              <p className='font-medium text-gray-800 mt-4'>Storage</p>
              <p>Store folded in a cool, dry place. Avoid prolonged exposure to direct sunlight to preserve color integrity.</p>
            </div>
          )}
          {activeTab === 'materials' && (
            <div className='space-y-3'>
              <p>All our products are crafted from carefully selected, premium-quality fabrics designed for comfort and durability.</p>
              <div className='space-y-2 mt-4'>
                <p><span className='font-medium text-gray-800'>Fabric Quality:</span> Pre-shrunk, color-fast dyes for long-lasting wear</p>
                <p><span className='font-medium text-gray-800'>Sourcing:</span> Ethically sourced materials from certified suppliers</p>
                <p><span className='font-medium text-gray-800'>Sustainability:</span> We are committed to reducing our environmental footprint through responsible manufacturing practices</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>You May Also Like</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                _id={relatedProduct._id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                image={relatedProduct.image[0]}
                bestseller={relatedProduct.bestseller}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product

