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
import Admin from './components/Admin/Admin';
import axios from 'axios';

function App() {
  const state = useContext(GlobalState);
  const isLogged = state?.userAPI.isLogged;
  // const isAdmin = true;
  const isAdmin = state?.userAPI.isAdmin;
  console.log(isAdmin, isLogged);

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
                  <h1>HOME</h1>
                </>
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={!isLogged && <Register />} />
            <Route path="/login" element={!isLogged && <Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/cart" element={<Cart />} />
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
