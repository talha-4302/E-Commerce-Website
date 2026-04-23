import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.js'
import { assets } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import { toast } from 'react-toastify'

const Product = () => {
  const { productid } = useParams()
  const { currency, addToCart, addToWishlist, isInWishlist, backendUrl } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])

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
    if (!product) return;
    const sizeToAdd = selectedSize || product.sizes?.[0] || null;
    addToCart(product, sizeToAdd, 1);
  }

  const handleAddToWishlist = () => {
    if (!product) return;
    if (isInWishlist(product._id)) {
      toast.info('Already in wishlist',{
        autoClose:1500,
      });
      return;
    }
    addToWishlist(product);
    toast.success('Added to wishlist',{
      autoClose:1500
    });
  }

  // Dummy reviews data
  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      text: "Excellent quality and fits perfectly! Highly recommend this product.",
      date: "2 weeks ago"
    },
    {
      name: "Sarah Smith",
      rating: 4,
      text: "Great value for money. Comfortable and stylish. Only wish it came in more colors.",
      date: "1 month ago"
    },
    {
      name: "Mike Johnson",
      rating: 5,
      text: "Perfect fit and amazing quality. Will definitely buy again!",
      date: "3 weeks ago"
    },
    {
      name: "Emma Wilson",
      rating: 4,
      text: "Love the design and comfort. Delivery was fast and packaging was great.",
      date: "1 week ago"
    }
  ]

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
                className={`w-[20%] sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === index ? 'border-black' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1'>
            <img
              src={ product.image[selectedImage] || product.image[0] }
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

          {/* Stars and Reviews */}
          <div className='flex items-center gap-1 mb-4'>
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src={star <= 4 ? assets.star_icon : assets.star_dull_icon}
                alt='star'
                className='w-4 h-4'
              />
            ))}
            <span className='text-sm text-gray-600 ml-2'>(250)</span>
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
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size
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

      {/* Reviews Section */}
      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Customer Reviews</h2>
        <div className='flex overflow-x-auto gap-4 pb-4'>
          {reviews.map((review, index) => (
            <div key={index} className='flex-shrink-0 w-64 md:w-72 bg-white p-4 rounded border border-gray-200'>
              <div className='flex items-center gap-2 mb-2'>
                <span className='font-medium text-gray-800'>{review.name}</span>
                <div className='flex'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      src={star <= review.rating ? assets.star_icon : assets.star_dull_icon}
                      alt='star'
                      className='w-3 h-3'
                    />
                  ))}
                </div>
              </div>
              <p className='text-sm text-gray-600 mb-2'>{review.text}</p>
              <p className='text-xs text-gray-400'>{review.date}</p>
            </div>
          ))}
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

