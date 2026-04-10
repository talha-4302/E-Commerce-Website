import React from 'react'
import { assets } from '../assets/assets'
import NewsletterSection from '../components/NewsletterSection'

const Contact = () => {
  return (
    <div >
          <div className='h-[1px] bg-gray-300 mb-8'></div>

          <div className='flex justify-center' ><div className ='inline-flex gap-2 items-center mb-20'>
              <p className='text-3xl text-gray-500'>Contact <span className ='text-gray-700 font-medium'>Us</span></p>
              <p className = 'w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
          </div></div>
          <div className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start mb-16'>
            <div className='space-y-6'>
              <p className='text-lg text-gray-700'>Have a question or need assistance? Our support team is here to help.</p>
              <div className='p-6 border border-gray-200 rounded bg-white'>
                <p className='text-sm uppercase text-gray-500 mb-3'>Contact Details</p>
                <div className='space-y-3 text-gray-700'>
                  <p><span className='font-semibold'>Email:</span> support@yourstore.com</p>
                  <p><span className='font-semibold'>Phone:</span> +1 (555) 123-4567</p>
                  <p><span className='font-semibold'>Address:</span> 123 Fashion Avenue, Suite 400, New York, NY 10001</p>
                  <p><span className='font-semibold'>Support Hours:</span> Mon - Fri: 9am - 6pm</p>
                </div>
              </div>
            </div>

            <div className='grid gap-6 justify-items-center'>
              <div className='overflow-hidden rounded-lg shadow-sm w-full'>
                <img src={assets.contact_img} alt='Contact us' className='w-full h-full object-cover max-h-[520px]' />
              </div>
              
            </div>
            
          </div>

          <NewsletterSection/>
    </div>
  )
}

export default Contact
