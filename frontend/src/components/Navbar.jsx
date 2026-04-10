import React, {  useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {assets} from '../assets/assets.js'
import { ShopContext } from '../context/ShopContext.js'


const Navbar = () => {

    const {mobileFilterVisible, mobileMenuVisible, setMobileMenuVisible, setMobileFilterVisible, cartItemCount } = useContext(ShopContext);


  return (
    <div className = 'flex items-center justify-between py-5 font-medium'>
      
      <img src ={assets.logo} className = 'w-36' alt=""/>

        
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            <NavLink to='/'className ='flex flex-col items-center gap-1 '>
                <p>HOME</p>
                <hr className ='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to='/collection' className ='flex flex-col items-center gap-1 '>
                <p>COLLECTION</p>
                <hr className ='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to='/about'className ='flex flex-col items-center gap-1 '>
                <p>ABOUT</p>
                <hr className ='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to='/contact'className ='flex flex-col items-center gap-1 '>
                <p>CONTACT</p>
                <hr className ='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

        </ul>

        <div className ='flex items-center gap-6'>
            <img src={assets.search_icon} className='w-5'></img>
            
            <div className = "group relative">
                <img src ={assets.profile_icon} className ="w-5 cursor-pointer" alt=""/>
                <div className={`group-hover:${!mobileFilterVisible?'block':null} hidden absolute z-40 dropdown-menu right-0 pt-4`}>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded' >
                        <p className='cursor-pointer hover:text-black '>My Profile</p>
                        <p className='cursor-pointer hover:text-black '>Orders</p>
                        <p className='cursor-pointer hover:text-black '>Logout</p>
                    </div>
                </div>
            </div>

             <Link to='/cart' className='relative'>
             <img src ={assets.cart_icon} className='w-5 min-w-5' />
             {cartItemCount > 0 && (
               <p className='absolute right-[-5px] bottom-[-5px] min-w-[16px] px-[2px] text-center text-white leading-4 bg-black rounded-full text-[8px]'>
                 {cartItemCount}
               </p>
             )}
             </Link>
             <img onClick={()=>{ {mobileFilterVisible?setMobileFilterVisible(false):null} setMobileMenuVisible(true); }} className ='w-5 cursor-pointer sm:hidden' src ={assets.menu_icon}  alt=""/>


        </div>


        {/*Side Bar Menu for mobile*/}
        <div className={`fixed top-0  right-0 overflow-hidden bg-white transition-all z-50 ${mobileMenuVisible?'w-full h-screen':'w-0'}`}>
            <div className='flex flex-col text-gray-600'>
                <div onClick={()=>setMobileMenuVisible(false)} className='flex items-center gap-4 p-3'>
                    <img className='h-4 rotate-180'src={assets.dropdown_icon}></img>
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setMobileMenuVisible(false)} className= 'py-2 pl-6 border'to ='/' >HOME</NavLink>
                <NavLink onClick={()=>setMobileMenuVisible(false)} className= 'py-2 pl-6 border' to ='/collection' >COLLECTION</NavLink> 
                <NavLink onClick={()=>setMobileMenuVisible(false)} className= 'py-2 pl-6 border'  to ='/about' >ABOUT</NavLink> 
                <NavLink onClick={()=>setMobileMenuVisible(false)}  className= 'py-2 pl-6 border' to ='/contact' >CONTACT</NavLink>
                
            </div>
        </div>
         

       

    </div>
  )
}

export default Navbar
