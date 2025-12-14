import React from 'react'
import {Route,Routes, Navigate} from "react-router-dom"
import Help from './Help'
import Home from './Home'
import UserLoginComponent from './Login'
import Registration from './Registration'
import About from './About'
import Contacts from './Contacts'
import FAQ from './FAQ'
import Searchbar from './searchbar'
import Navbar from '../Components/Navbar'
import SearchPage from '../ProductPage/SearchPage'
import Profile from './Profile'
import ProductPage from '../ProductPage/Products'
import ProductPage1 from '../ProductPage/Products1'
import SingleProduct from '../ProductPage/Singleproduct'
import PrivateRoute from './PrivateRoutes'
import OTP from '../ProductPage/Checkout/Otp'
import Checkout from './Checkout'
import ScrollToTop from './ScrollToTop'
const AllRoute = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Searchbar />} />
        <Route path='/login' element={<UserLoginComponent />} />
        <Route path='/help' element={<Help />} />
        <Route path='/about' element={<About />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/registration' element={<Registration />} />
        <Route path="/products" element={<ProductPage />}></Route>
        <Route path="/products1" element={<ProductPage1 />}></Route>
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Navigate to="/" replace />}></Route>
        <Route path="/checkout" element={<PrivateRoute><Checkout/></PrivateRoute>}></Route>
        <Route path="/otp" element={<PrivateRoute><OTP/></PrivateRoute>}></Route>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
        <Route path="/searchpage" element={<SearchPage />}></Route>
    </Routes>
    
    </>
  )
}

export default AllRoute