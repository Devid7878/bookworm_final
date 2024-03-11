import { ArrowBackIosNewRounded } from '@mui/icons-material';
import React, { ChangeEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

import img1 from './../../static/imgs/mastercard-full-svgrepo-com.svg';
import img2 from './../../static/imgs/amazon-pay-svgrepo-com.svg';
import img3 from './../../static/imgs/amex-svgrepo-com.svg';
import axios from 'axios';
import { GlobalState } from '../../globalState/GlobalState';
import Swal from 'sweetalert2';

function Checkout() {
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
  });

  const state = useContext(GlobalState);
  const token = state?.token;
  const cart = state?.userAPI.cart;
  const setCart = state?.userAPI.setCart;
  const callback = state?.userAPI.callback;
  const emptyDBCart = state?.userAPI.emptyDBCart;
  const setCallback = state?.userAPI.setCallback;

  const navigate = useNavigate();

  const tranSuccess = async (address: {
    address_line1: string;
    address_line2: string;
  }) => {
    const res = await axios.post(
      `http://localhost:5000/api/payment`,
      { cart, address },
      {
        headers: { Authorization: token },
      }
    );

    setCart && setCart([]);
    Swal.fire('Success!', 'Thank you for purchase!', 'success');
    setCallback && setCallback(!callback);
    emptyDBCart && emptyDBCart();

    navigate('/');
  };

  return (
    <>
      <div className="top-header-checkout">
        <Link to="/cart">
          <ArrowBackIosNewRounded />
          <p>Back</p>
        </Link>
      </div>
      <div className="checkout-main-container">
        <div>
          <div className="checkout-container">
            <div className="address-details">
              <p>Address</p>

              <div className="card-name">
                <label>
                  Address Line 1 <sup>*</sup>{' '}
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    required
                    value={address.address_line1}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setAddress({
                        ...address,
                        address_line1: event.target.value,
                      });
                    }}
                  />
                </label>
                <label>
                  Address Line 2 <sup>*</sup>{' '}
                  <input
                    type="text"
                    required
                    placeholder="Address Line 2"
                    value={address.address_line2}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setAddress({
                        ...address,
                        address_line2: event.target.value,
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="checkout-container">
            <div className="address-details">
              <p>Payment Details</p>
              <div className="ads">
                <div>
                  <img src={img1} alt="pay1" />
                </div>
                <div>
                  <img src={img2} alt="pay1" />
                </div>
                <div>
                  <img src={img3} alt="pay1" />
                </div>
              </div>
              <div className="card-name">
                <label>
                  Card no <sup>*</sup>{' '}
                  <input type="number" placeholder="Card Number" required />
                </label>
                <label>
                  Card holder <sup>*</sup>{' '}
                  <input type="text" placeholder="Card Holder" required />
                </label>
              </div>
              <div className="expiry">
                <label>
                  <div>
                    <span>
                      Expiry Date <sup>*</sup>
                    </span>{' '}
                    <input type="number" placeholder="MM" required />
                    <input type="number" placeholder="YYYY" required />
                    <label>
                      CVC <sup>*</sup>{' '}
                      <input type="password" placeholder="CVC" required />
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="payment">
            <button
              className="payment-btn"
              onClick={() => tranSuccess(address)}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
