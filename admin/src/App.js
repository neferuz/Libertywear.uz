import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import Products from './Pages/Products';
import Orders from './Pages/Orders';
import Users from './Pages/Users';
import Settings from './Pages/Settings';
import Categories from './Pages/Categories';
import AddCategory from './Pages/AddCategory';
import AddProduct from './Pages/AddProduct';
import UserDetail from './Pages/UserDetail';
import OrderDetail from './Pages/OrderDetail';
import About from './Pages/About';
import Contacts from './Pages/Contacts';
import FAQ from './Pages/FAQ';
import ContactMessages from './Pages/ContactMessages';
import SocialLinks from './Pages/SocialLinks';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<AddProduct />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/add" element={<AddCategory />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact-messages" element={<ContactMessages />} />
                <Route path="/social-links" element={<SocialLinks />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

