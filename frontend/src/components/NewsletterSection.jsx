import React from 'react'

const NewsletterSection = () => {
  return (
    <section className='my-16 rounded-[2rem] bg-[#fafafc] p-8 sm:p-12'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8 max-w-xl'>
          <p className='text-sm font-medium uppercase tracking-[0.24em] text-[#414141]'>Stay in the loop</p>
          <h2 className='mt-3 text-3xl font-semibold text-[#222] sm:text-4xl'>Subscribe to our newsletter</h2>
          <p className='mt-3 text-sm text-gray-600'>Get new arrivals, offers, and styling tips delivered straight to your inbox.</p>
        </div>
        <form className='flex flex-col gap-3 sm:flex-row'>
          <label htmlFor='newsletter-email' className='sr-only'>Email address</label>
          <input
            id='newsletter-email'
            type='email'
            placeholder='Enter your email'
            className='flex-1 rounded-full border border-gray-300 bg-white px-5 py-4 text-sm text-gray-900 outline-none transition focus:border-[#414141] focus:ring-2 focus:ring-[#414141]/10'
          />
          <button
            type='submit'
            className='inline-flex items-center justify-center rounded-full bg-[#414141] px-6 py-4 text-sm font-semibold text-white transition hover:bg-black'
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
