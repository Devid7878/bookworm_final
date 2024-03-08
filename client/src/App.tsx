import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BookHomePage from './pages/BookHomePage';
import Header from './components/Header/Header';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { DataProvider, GlobalState } from './globalState/GlobalState';
import ScrollToTop from './components/ScrollToTop';
import Products from './components/Products/Products';
import ProductDetail from './components/Products/ProductDetails';
import NotFound from './components/Support/NotFound';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Cart from './components/Cart/Cart';
import History from './components/Auth/History';
import Seller from './components/Seller/Seller';
import axios from 'axios';
import Admin from './components/Admin/Admin';
import Home from './components/Home/Home';

function App() {
  const state = useContext(GlobalState);
  const isLogged = state?.userAPI.isLogged;
  // const isSeller = true;
  const isSeller = state?.userAPI.isSeller;
  console.log(isSeller, isLogged);

  return (
    <div className="App">
      {/* <BrowserRouter>
        <Header />
        <BookHomePage />
        <Footer />
      </BrowserRouter> */}
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* <Pages /> */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                </>
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={!isLogged && <Register />} />
            <Route path="/login" element={!isLogged && <Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/seller/:id" element={<Seller />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:id" element={<Admin />} />

            <Route path="#" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;
