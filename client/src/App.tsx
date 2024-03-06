import React, { useContext } from 'react';
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

function App() {
  const state = useContext(GlobalState);
  // const isLogged = state?.userAPI.isLogged;
  const isLogged = localStorage.getItem('Login');
  const isAdmin = true;
  // const isAdmin = state?.userAPI.isAdmin;

  return (
    <div className="App">
      {/* <BrowserRouter>
        <Header />
        <BookHomePage />
        <Footer />
      </BrowserRouter> */}

      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <Routes>
            {/* <Pages /> */}
            <Route path="/" element={<Products />} />
            {/* <Route path="/products" exact component={Products} /> */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/register"
              element={isLogged ? <NotFound /> : <Register />}
            />
            <Route
              path="/login"
              element={isLogged ? <NotFound /> : <Login />}
            />
            <Route
              path="/history"
              element={isLogged ? <History /> : <NotFound />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={isAdmin ? <Admin /> : <NotFound />} />
            <Route
              path="/admin/:id"
              element={isAdmin ? <Admin /> : <NotFound />}
            />

            <Route path="#" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
          <Footer />
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;
