import React, { useContext, useState } from 'react'
import { Link, Navigate, NavLink, replace, useNavigate, useSearchParams } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { ShopContext } from '../context/ShopContext.js'
import { AuthContext } from '../context/AuthContext.jsx'




const Navbar = () => {
    const { mobileFilterVisible, mobileMenuVisible, setMobileMenuVisible, setMobileFilterVisible, cartItemCount } = useContext(ShopContext);
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

    // Sync input with URL param when component mounts or URL changes
    React.useEffect(() => {
        const query = searchParams.get('q');
        setSearchInput(query || '');
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/collection?q=${encodeURIComponent(searchInput.trim())}`);
        } else {
            navigate('/collection');
        }
    };

    const HandleUserLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/');
    }


    return (
        <div className='flex flex-col border-b border-gray-100'>
            {/* Main Navbar Row */}
            <div className='flex items-center justify-between py-4 sm:py-5 font-medium gap-4 sm:gap-10'>
                
                {/* Logo */}
                <Link to='/' className='flex-shrink-0'>
                    <img src={assets.logo} className='w-24 sm:w-32' alt="Forever Logo" />
                </Link>

                {/* Desktop Integrated Search Bar */}
                <form onSubmit={handleSearchSubmit} className='hidden sm:flex flex-1 max-w-2xl relative group'>
                    <input
                        type='text'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder='Search for products, collections and more...'
                        className='w-full bg-gray-100/50 border border-transparent rounded-full py-2 px-10 text-sm outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all'
                    />
                    <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                        <img src={assets.search_icon} className='w-4' alt="Search" />
                    </button>
                    {searchInput && (
                        <img 
                            onClick={() => { setSearchInput(''); navigate('/collection'); }} 
                            src={assets.cross_icon} 
                            className='w-3 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-40 hover:opacity-100' 
                            alt="Clear Search" 
                        />
                    )}
                </form>

                {/* Right Side: Links & Icons */}
                <div className='flex items-center gap-4 sm:gap-8 flex-shrink-0'>
                    
                    {/* Desktop Nav Links */}
                    <ul className='hidden lg:flex gap-6 text-[11px] font-bold tracking-[0.2em] text-gray-600'>
                        <NavLink to='/' className='hover:text-black transition-colors'>HOME</NavLink>
                        <NavLink to='/collection' className='hover:text-black transition-colors'>COLLECTION</NavLink>
                        <NavLink to='/about' className='hover:text-black transition-colors'>ABOUT</NavLink>
                        <NavLink to='/contact' className='hover:text-black transition-colors'>CONTACT</NavLink>
                    </ul>

                    <div className='flex items-center gap-5 sm:gap-6'>
                        <div className="group relative">
                            <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="Profile" />
                            <div className={`${mobileFilterVisible ? null : 'group-hover:block'} hidden absolute z-40 dropdown-menu right-0 pt-4`}>
                                <div className='flex flex-col w-48 bg-white text-gray-700 rounded-sm shadow-lg border border-gray-100'>
                                    <div className='px-5 py-2.5 border-b border-gray-100'>
                                        <p className='text-[10px] text-gray-400 uppercase tracking-wider mb-0.5'>Account</p>
                                        <Link to='/userlogin' className='block text-sm font-medium hover:text-black transition-colors'>Login / Sign Up</Link>
                                    </div>
                                    <div className='py-1'>
                                        <Link to='/orders' className='flex items-center gap-3 px-5 py-2 text-sm hover:bg-gray-50 transition-colors'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                            Orders
                                        </Link>
                                        <Link to='/wishlist' className='flex items-center gap-3 px-5 py-2 text-sm hover:bg-gray-50 transition-colors'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                            Wishlist
                                        </Link>
                                    </div>
                                    <div className='border-t border-gray-100'>
                                        <p onClick={HandleUserLogout} className='flex items-center gap-3 px-5 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='w-4 min-w-4'>
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to='/cart' className='relative'>
                            <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
                            {cartItemCount > 0 && (
                                <p className='absolute right-[-5px] bottom-[-5px] min-w-[16px] px-[2px] text-center text-white leading-4 bg-black rounded-full text-[8px]'>
                                    {cartItemCount}
                                </p>
                            )}
                        </Link>
                        <img onClick={() => { if (mobileFilterVisible) setMobileFilterVisible(false); setMobileMenuVisible(true); }} className='w-5 cursor-pointer lg:hidden' src={assets.menu_icon} alt="Menu" />
                    </div>
                </div>
            </div>

            {/* Mobile Search Row - Independent row on small screens */}
            <div className='pb-4 sm:hidden'>
                <form onSubmit={handleSearchSubmit} className='w-full relative'>
                    <input
                        type='text'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder='Search products...'
                        className='w-full bg-gray-100/60 border border-transparent rounded-full py-2 px-10 text-xs outline-none focus:bg-white focus:border-gray-200'
                    />
                    <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                        <img src={assets.search_icon} className='w-3.5' alt="Search" />
                    </button>
                </form>
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
