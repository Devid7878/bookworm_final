import { ArrowBackIosNewRounded } from '@mui/icons-material';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

import axios from 'axios';
import { GlobalState } from '../../globalState/GlobalState';
import Swal from 'sweetalert2';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';

function Checkout() {
	const [address, setAddress] = useState({
		address_line1: '',
		address_line2: '',
	});

	const state = useContext(GlobalState);
	const token = state?.token;
	const setCart = state?.userAPI.setCart;
	const cart = state?.userAPI.cart;
	const callback = state?.userAPI.callback;
	const emptyDBCart = state?.userAPI.emptyDBCart;
	const setCallback = state?.userAPI.setCallback;

	const navigate = useNavigate();

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

	const tranSuccess = async (address: {
		address_line1: string;
		address_line2: string;
	}) => {
		if (
			address.address_line1.trim() === '' ||
			address.address_line2.trim() === ''
		)
			Swal.fire('Shipping Address Line 1 & Addres Line 2 cannot be empty!');
		else {
			const res = await axios.post(
				`http://localhost:5000/api/payment`,
				{ cart, address },
				{
					headers: { Authorization: token },
				},
			);

			setCart && setCart([]);
			if (res.statusText === 'OK')
				Swal.fire('Success!', 'Thank you for purchase!', 'success');
			setCallback && setCallback(!callback);
			emptyDBCart && emptyDBCart();

			navigate('/');
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setAddress({ ...address, [name]: value });
	};

	return (
		<>
			<div className='top-header-checkout'>
				<Link to='/cart'>
					<ArrowBackIosNewRounded />
					<p>Back</p>
				</Link>
			</div>
			<div className='checkout-main-container'>
				<div>
					<div className='checkout-container'>
						{/* <div className='address-details'>
							<p>Address</p>

							<div className='card-name'>
								<label>
									<input
										type='text'
										placeholder='Address Line 1'
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
										type='text'
										required
										placeholder='Address Line 2'
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
						</div> */}

						<Box
							sx={{
								marginTop: 8,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}>
							<Typography component='h5' variant='h5'>
								Shipping Address
							</Typography>
							<Box
								component='form'
								sx={{ mt: 1 }}
								onSubmit={() => tranSuccess(address)}>
								<TextField
									// variant="h4"
									margin='normal'
									required
									fullWidth
									id='address_line1'
									label='Address Line 1'
									name='address_line1'
									autoFocus
									value={address.address_line1}
									onChange={handleChange}
								/>
								<TextField
									margin='normal'
									required
									fullWidth
									name='address_line2'
									label='Address Line 2'
									id='address_line2'
									value={address.address_line2}
									onChange={handleChange}
								/>
							</Box>
						</Box>
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

					<div className='payment'>
						<button
							type='submit'
							className='payment-btn'
							onClick={() => tranSuccess(address)}>
							Pay Now
						</button>
					</div>
				</div>
				{/* <div className='checkout-container'>
						<div className='address-details'>
							<p>Payment Details</p>
							<div className='ads'>
								<div>
									<img src={img1} alt='pay1' />
								</div>
								<div>
									<img src={img2} alt='pay1' />
								</div>
								<div>
									<img src={img3} alt='pay1' />
								</div>
							</div>
							<div className='card-name'>
								<label>
									Card no <sup>*</sup>{' '}
									<input type='number' placeholder='Card Number' required />
								</label>
								<label>
									Card holder <sup>*</sup>{' '}
									<input type='text' placeholder='Card Holder' required />
								</label>
							</div>
							<div className='expiry'>
								<label>
									<div>
										<span>
											Expiry Date <sup>*</sup>
										</span>{' '}
										<input type='number' placeholder='MM' required />
										<input type='number' placeholder='YYYY' required />
										<label>
											CVC <sup>*</sup>{' '}
											<input type='password' placeholder='CVC' required />
										</label>
									</div>
								</label>
							</div>
						</div>
					</div> */}
				{/* <div className='payment'>
						<button
							className='payment-btn'
							onClick={() => tranSuccess(address)}>
							Pay Now
						</button>
					</div> */}
			</div>
		</>
	);
}

export default Checkout;
