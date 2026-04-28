import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='relative h-[450px] sm:h-[650px] mt-8 flex items-center overflow-hidden rounded-xl shadow-xl group'>
      {/* Immersive Background Image */}
      <img
        src={assets.hero_img3}
        className='absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[4000ms] ease-out'
        alt="Hero Collection"
      />

      {/* Subtle Vignette Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent'></div>

      {/* Editorial Content Card */}
      <div className='relative z-10 ml-6 sm:ml-24 max-w-[90%] sm:max-w-md bg-white/95 backdrop-blur-md p-8 sm:p-14 shadow-2xl'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='w-10 h-[1.5px] bg-gray-800'></span>
          <span className='font-bold text-[9px] sm:text-[11px] tracking-[0.4em] text-gray-400 uppercase'>New Season Edit</span>
        </div>

        <h1 className='prata-regular text-4xl sm:text-5xl text-gray-900 leading-none mb-6 uppercase tracking-tighter'>
          Modern <br />
          <span className='italic prata-regular text-gray-400 text-3xl sm:text-5xl normal-case tracking-tight block mt-1'>Heritage</span>
        </h1>

        <p className='text-[11px] sm:text-[13px] text-gray-500 mb-8 leading-relaxed font-normal max-w-[280px]'>
          Discover the perfect harmony of timeless craftsmanship and contemporary style.
        </p>

        <div className='flex items-center gap-4'>
          <Link to='/collection' className='bg-black text-white px-10 py-4 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 inline-block'>
            Explore Now
          </Link>
          <div className='h-[1px] w-12 bg-gray-200 hidden sm:block'></div>
        </div>
      </div>

      {/* Accent Element */}
      <div className='absolute bottom-10 right-10 hidden lg:block'>
        <p className='text-white/30 text-8xl font-serif italic prata-regular select-none'>EZSHOP.</p>
      </div>
    </div>
  )
}

export default Hero
