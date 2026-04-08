import React from 'react'
import { assets } from '../assets/assets'
import Title from './Title'

const features = [
  {
    icon: assets.quality_icon,
    title: 'Premium Quality',
    description: 'Only the best styles and fabrics selected for every season.'
  },
  {
    icon: assets.search_icon,
    title: 'Curated Selection',
    description: 'Discover handpicked looks made easy to shop and style.'
  },
  {
    icon: assets.exchange_icon,
    title: 'Fast Shipping',
    description: 'Quick delivery and easy returns for a seamless shopping experience.'
  }
]

const FeatureSection = () => {
  return (
    <section className='my-16'>
      <div className='text-center py-6'>

        <div className ='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-500 text-2xl'>WHY <span className ='text-gray-700 font-medium'>CHOOSE US</span></p>
            <p className = 'w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
         </div>

        <p className='mx-auto mb-2 text-md text-gray-600'>
          Three powerful ways we make your shopping experience better, from product quality to delivery speed.
        </p>

      </div>
      <div className='grid gap-6 md:grid-cols-3'>
        {features.map((feature) => (
          <div key={feature.title} className='rounded-[2rem] border border-gray-200 bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md'>
            <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100'>
              <img src={feature.icon} alt={`${feature.title} icon`} className='h-7 w-7 object-contain' />
            </div>
            <h3 className='text-lg font-semibold text-[#222]'>{feature.title}</h3>
            <p className='mt-3 text-sm text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
