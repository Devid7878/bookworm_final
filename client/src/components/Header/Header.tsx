import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';

import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import Swal from 'sweetalert2';
import './Header.css';
import Logo from '../Logo/Logo';

export default function Header() {
  const state = useContext(GlobalState);
  const token = state?.token;
  const isLogged = state?.userAPI.isLogged;
  const setIsLogged = state?.userAPI.setIsLogged;
  const isSeller = state?.userAPI.isSeller;
  const isAdmin = state?.userAPI.isAdmin;
  const cart = state?.userAPI.cart;
  const setProducts = state?.productsAPI.setProducts;
  const setCategory = state?.productsAPI.setCategory;
  const infor = state?.userAPI.infor;

  const [isMenuClicked, setIsMenuClicked] = useState(false);

  useEffect(() => {
    async function getProducts() {
      setProducts && setProducts((products) => products);
    }
    getProducts();
  }, [setProducts]);

  const navigate = useNavigate();

  const logoutUser = async () => {
    const data = await Swal.fire('Are you sure you want to logout?');

    if (data.isConfirmed) {
      await axios.get(`http://localhost:5000/user/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('Login');
      localStorage.removeItem('token');
      setIsLogged && setIsLogged(false);
      navigate('/');
    }
  };
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
            <Logo />
          </Link>
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
                <>
                  <li>
                    <Link to="/book-listings">Listings</Link>
                  </li>
                  <li>
                    <Link to="/all-users">All Users</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/history">History</Link>
                </li>
              ))}

            {isLogged ? (
              <>
                <li>
                  <Link to="/cart" className="shopping-cart">
                    <ShoppingCartRoundedIcon />
                    <span>{cart?.length}</span>
                  </Link>
                </li>
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
              </>
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
          <p className="user-info-modal">
            {infor && infor?.length > 0 && infor.at(0)}
          </p>
          <div className="profile">
            <img
              src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              alt=""
            />
          </div>
        </div>
        {!isMenuClicked ? (
          <div
            className="hamburger"
            onClick={() => {
              setIsMenuClicked((isMenuClicked) => !isMenuClicked);
            }}
          >
            <MenuIcon />
          </div>
        ) : (
          <div
            className="hamburger"
            onClick={() => {
              setIsMenuClicked((isMenuClicked) => !isMenuClicked);
            }}
          >
            <CloseRoundedIcon />
          </div>
        )}
        {isMenuClicked && (
          <div className="navbar-mobile">
            <ul className="nav-links-mobile">
              <li>
                <Link to="/products">Products</Link>
              </li>
              {isLogged &&
                (isSeller ? (
                  <li>
                    <Link to="/seller">Seller</Link>
                  </li>
                ) : isAdmin ? (
                  <>
                    <li>
                      <Link to="/book-listings">Listings</Link>
                    </li>
                    <li>
                      <Link to="/all-users">All Users</Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/history">History</Link>
                  </li>
                ))}

              {isLogged ? (
                <>
                  <li>
                    <Link to="/cart" className="shopping-cart">
                      {/* <ShoppingCartRoundedIcon />
                      <span>{cart?.length}</span> */}
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={logoutUser}
                      className="logout-button button"
                    >
                      Logout
                    </Link>
                  </li>
                </>
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
          </div>
        )}
      </nav>
    </header>
  );
}
