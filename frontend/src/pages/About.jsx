import React from 'react'
import { assets } from '../assets/assets'
import NewsletterSection from '../components/NewsletterSection'

const About = () => {
  return (
    <div >
      <div className='h-[1px] bg-gray-300 mb-8'></div>

<div className='flex justify-center' ><div className ='inline-flex gap-2 items-center mb-20'>
              <p className='text-3xl text-gray-500'>About <span className ='text-gray-700 font-medium'>Us</span></p>
              <p className = 'w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
          </div></div>
      <div className='grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center mb-16'>
        <div>
          <p className='text-lg text-gray-700 mb-6'>
            Welcome to our store — where comfort meets style in every piece. We are a modern fashion destination built for people who value quality, ease, and thoughtfully designed apparel.
          </p>
          <p className='text-gray-600 leading-relaxed mb-6'>
            Our mission is to make shopping effortless and inspiring. We handpick each collection to deliver timeless wardrobe essentials, bold statement pieces, and everyday favorites that look great and feel amazing.
          </p>
        </div>

        <div className='overflow-hidden rounded-lg shadow-sm'>
          <img src={assets.about_img} alt='About us' className='w-full h-full object-cover max-h-[520px]' />
        </div>
      </div>

      <div className='grid gap-10 md:grid-cols-3'>
        <div className='p-6 border border-gray-200 rounded'>
          <h2 className='text-xl font-semibold mb-4'>Our Story</h2>
          <p className='text-gray-600 leading-relaxed'>We started with a simple idea: make beautifully designed clothing accessible to everyone. Since then, we have grown into a trusted brand known for modern styles and everyday comfort.</p>
        </div>
        <div className='p-6 border border-gray-200 rounded'>
          <h2 className='text-xl font-semibold mb-4'>What We Stand For</h2>
          <p className='text-gray-600 leading-relaxed'>Transparency, reliability, and exceptional service are the foundation of everything we do. Our customers are at the heart of every decision.</p>
        </div>
        <div className='p-6 border border-gray-200 rounded'>
          <h2 className='text-xl font-semibold mb-4'>Our Vision</h2>
          <p className='text-gray-600 leading-relaxed'>To become the go-to online destination for consumers who want smartly styled products delivered with care and speed.</p>
        </div>
      </div>

      <NewsletterSection />
    </div>
  )
}

export default About
