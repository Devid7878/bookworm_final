import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import Logo from './images/logo.jpg';
import './Header.css';
// import './Header.scss';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export default function Header() {
  const state = useContext(GlobalState);
  const isLogged = state?.userAPI.isLogged;
  const setIsLogged = state?.userAPI.setIsLogged;
  const isSeller = state?.userAPI.isSeller;
  const isAdmin = state?.userAPI.isAdmin;
  // const isAdmin  = state?.userAPI.isAdmin;
  const cart = state?.userAPI.cart;
  const search = state?.productsAPI.search;
  const setSearch = state?.productsAPI.setSearch;
  const infor = state?.userAPI.infor;
  const category = state?.productsAPI.category;
  const products = state?.productsAPI.products;
  const setProducts = state?.productsAPI.setProducts;
  const setCategory = state?.productsAPI.setCategory;

  const [handleSearch, setHandleSearch] = useState('');
  const [allProducts, setAllProducts] = useState<any>([]);

  useEffect(() => {
    async function getProducts() {
      setSearch && setSearch(handleSearch);
      setProducts && setProducts((products) => products);
    }
    getProducts();
  }, [handleSearch]);

  const navigate = useNavigate();

  const logoutUser = async () => {
    await axios.get(`http://localhost:5000/user/logout`, {
      withCredentials: true,
    });
    localStorage.removeItem('Login');
    localStorage.removeItem('token');
    setIsLogged && setIsLogged(false);
    navigate('/');
  };

  console.log('Admin: ', isAdmin, 'Seller: ', isSeller);

  return (
    <header>
      <nav className="container">
        <div className="logo">
          <Link
            to="/"
            onClick={() => {
              if (setCategory) setCategory('');
            }}
          >
            <h1>LOGO</h1>
          </Link>
        </div>
        <div className="search-bar">
          <SearchRoundedIcon />
          <input
            name=""
            placeholder="Search for products..."
            className="search__input"
            value={handleSearch}
            onChange={(e) => setHandleSearch(e.target.value)}
          />
        </div>
        <div className="nav-links-container">
          <ul className="nav-links">
            <li>
              <Link to="/products">Products</Link>
            </li>
            {isLogged &&
              (isSeller ? (
                <li>
                  <Link to="/seller">Seller</Link>
                </li>
              ) : isAdmin ? (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              ) : (
                <li>
                  <Link to="/history">History</Link>
                </li>
              ))}

            {isLogged ? (
              <li>
                <Link
                  to="/"
                  onClick={logoutUser}
                  className="logout-button button"
                >
                  Logout
                  <LogoutRoundedIcon />
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="login-button button">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="register-button button">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="profile">
            <img
              src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              alt=""
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
