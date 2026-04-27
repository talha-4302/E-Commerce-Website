import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='my-16 py-8 bg-white w-full '>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid gap-8 md:grid-cols-3'>
          {/* Logo and Description */}
          <div>
            <img src={assets.logo} alt='Forever Logo' className='mb-4 h-8 w-auto' />
            <p className='text-sm text-gray-600'>
              Your go-to destination for fashion and style. Discover the latest trends and timeless pieces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/collection' className='text-sm text-gray-600 hover:text-gray-800'>
                  Collection
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-sm text-gray-600 hover:text-gray-800'>
                  About
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-sm text-gray-600 hover:text-gray-800'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>Get in Touch</h3>
            <div className='space-y-2 text-sm text-gray-600'>
              <p>Email: support@forever.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Fashion St, Style City, SC 12345</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 border-t border-gray-200 pt-8 text-center'>
          <p className='text-sm text-gray-600'>© 2026 Forever. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer