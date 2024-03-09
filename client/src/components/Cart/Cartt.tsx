import React, { useContext, useEffect, useState } from 'react';
import Header from '../Header/Header';
import './Cartt.css';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import Swal from 'sweetalert2';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

function Cartt() {
	const state = useContext(GlobalState);
	const cart = state?.userAPI.cart;
	console.log(cart);

	return (
		<div className='cart-main-container'>
			<Header />
			<div className='cart-container'>
				<div className='left'>
					<div className='left-top'>
						<p>Your Cart({cart?.length} Items)</p>
						<Link to='/products'>
							Continue Shopping <ArrowForwardIosRoundedIcon />
						</Link>
					</div>
					<div className='cart-items'>
						<CartItem />
					</div>
				</div>
				<div className='right'>
					<div className='right-top'>
						<p>Order Summary</p>
					</div>
					<div className='sub-total'>
						<p>Sub Total</p>
						<p>$2500</p>
					</div>
					<div className='delivery'>
						<p>Delivery</p>
						<p>$50</p>
					</div>
					<hr />
					<div className='total'>
						<p>Total</p>
						<p>$2550</p>
					</div>
					<Link to='/checkout'>
						<div className='checkout-btn'>
							<span>
								<CreditCardRoundedIcon />
							</span>
							Checkout
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Cartt;
