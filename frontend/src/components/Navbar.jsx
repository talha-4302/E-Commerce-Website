import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { ShopContext } from '../context/ShopContext.js'


const Navbar = ({ onSearchToggle }) => {

    const { mobileFilterVisible, mobileMenuVisible, setMobileMenuVisible, setMobileFilterVisible, cartItemCount } = useContext(ShopContext);
    const [searchOpen, setSearchOpen] = useState(false)

    const handleSearchToggle = () => {
        const newState = !searchOpen
        setSearchOpen(newState)
        if (onSearchToggle) {
            onSearchToggle(newState)
        }
    }


    return (
        <div className='flex items-center justify-between py-5 font-medium'>

            <img src={assets.logo} className='w-30 sm:w-36' alt="" />


            <ul className='hidden md:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1 '>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/collection' className='flex flex-col items-center gap-1 '>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/about' className='flex flex-col items-center gap-1 '>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/contact' className='flex flex-col items-center gap-1 '>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>
                <img src={assets.search_icon} className='w-5 cursor-pointer' onClick={handleSearchToggle} alt='Search' />


                <div className="group relative">
                    <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="" />
                    <div className={`${mobileFilterVisible ? null : 'group-hover:block'} hidden absolute z-40 dropdown-menu right-0 pt-4`}>
                        <div className='flex flex-col w-48 bg-white text-gray-700 rounded-sm shadow-lg border border-gray-100'>
                            <div className='px-5 py-2.5 border-b border-gray-100'>
                                <p className='text-[10px] text-gray-400 uppercase tracking-wider mb-0.5'>Account</p>
                                <Link to='/userlogin' className='block text-sm font-medium hover:text-black transition-colors'>Login / Sign Up</Link>
                            </div>
                            <div className='py-1'>
                                <Link to='/orders' className='flex items-center gap-3 px-5 py-2 text-sm hover:bg-gray-50 transition-colors'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 0 1-8 0"/>
                                    </svg>
                                    Orders
                                </Link>
                                <Link to='/wishlist' className='flex items-center gap-3 px-5 py-2 text-sm hover:bg-gray-50 transition-colors'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                    Wishlist
                                </Link>
                                <p className='flex items-center gap-3 px-5 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    My Profile
                                </p>
                            </div>
                            <div className='border-t border-gray-100'>
                                <p className='flex items-center gap-3 px-5 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                        <polyline points="16 17 21 12 16 7"/>
                                        <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' />
                    {cartItemCount > 0 && (
                        <p className='absolute right-[-5px] bottom-[-5px] min-w-[16px] px-[2px] text-center text-white leading-4 bg-black rounded-full text-[8px]'>
                            {cartItemCount}
                        </p>
                    )}
                </Link>
                <img onClick={() => { { mobileFilterVisible ? setMobileFilterVisible(false) : null } setMobileMenuVisible(true); }} className='w-5 cursor-pointer md:hidden' src={assets.menu_icon} alt="" />


            </div>


            {/*Side Bar Menu for mobile*/}
            <div className={`fixed top-0  right-0 overflow-hidden bg-white transition-all z-50 ${mobileMenuVisible ? 'w-full h-screen' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setMobileMenuVisible(false)} className='flex items-center gap-4 p-3'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon}></img>
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setMobileMenuVisible(false)} className='py-2 pl-6 border' to='/' >HOME</NavLink>
                    <NavLink onClick={() => setMobileMenuVisible(false)} className='py-2 pl-6 border' to='/collection' >COLLECTION</NavLink>
                    <NavLink onClick={() => setMobileMenuVisible(false)} className='py-2 pl-6 border' to='/about' >ABOUT</NavLink>
                    <NavLink onClick={() => setMobileMenuVisible(false)} className='py-2 pl-6 border' to='/contact' >CONTACT</NavLink>

                </div>
            </div>




        </div>
    )
}

export default Navbar
