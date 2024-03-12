import React, { useContext, useEffect, useState } from 'react';
import Header from '../Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { GlobalState } from '../../globalState/GlobalState';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import './Cart.css';

function Cartt() {
	const state = useContext(GlobalState);
	const cart = state?.userAPI.cart;

	const [total, setTotal] = useState(0);

	useEffect(() => {
		const totalCost = () => {
			let total = cart?.reduce(
				(prev, item: { price: number; quantity: number }) => {
					return prev + item.price * item.quantity;
				},
				0,
			);

			total && setTotal(total);
		};
		totalCost();
	}, [cart]);

	return (
		<div className='cart-main-container'>
			<Header />
			{cart?.length && cart?.length > 0 ? (
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
							<p>&#x20B9;{total}</p>
						</div>
						<div className='delivery'>
							<p>Delivery</p>
							<p>&#x20B9;50</p>
						</div>
						<hr />
						<div className='total'>
							<p>Total</p>
							<p>&#x20B9;{total + 50}</p>
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
			) : (
				<h1>'No Books in Cart!'</h1>
			)}
		</div>
	);
}

export default Cartt;
