import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Collection from '../pages/Collection'
import About from '../pages/About'
import Contact from '../pages/Contact'
import PlaceOrder from '../pages/PlaceOrder'
import Product from '../pages/Product'
import Cart from '../pages/Cart'
import Orders from '../pages/Orders'
import WishList from '../pages/WishList'
import UserLogin from '../pages/UserLogin'
import UserSignup from '../pages/UserSignup'

const StoreRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/collection' element={<Collection />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/place-order' element={<PlaceOrder />} />
      <Route path='/product/:productid' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/orders' element={<Orders />} />
      <Route path='/wishlist' element={<WishList />} />
      <Route path='/userlogin' element={<UserLogin />} />
      <Route path='/usersignup' element={<UserSignup />} />
    </Routes>
  )
}

export default StoreRoutes
