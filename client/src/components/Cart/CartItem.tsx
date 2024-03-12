import React, { useContext, useEffect, useState } from 'react';
import './CartItem.css';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { AddCircleOutlineRounded, CancelRounded } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import Swal from 'sweetalert2';

type ItemType = {
	_id: string;
	images: {
		url: string;
	};
	title: string;
	authors: string[];
	category: string;
	price: number;
	quantity: number;
};

function CartItem() {
	const [address, setAddress] = useState('');
	const state = useContext(GlobalState);
	const cart = state?.userAPI.cart;
	const setCart = state?.userAPI.setCart;
	const token = state?.token;
	const callback = state?.userAPI.callback;
	const setCallback = state?.userAPI.setCallback;
	const isLogged = state?.userAPI.isLogged;

	const [total, setTotal] = useState(0);

	const navigate = useNavigate();
	console.log(cart);

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

	const addToCart = async (cart: any) => {
		await axios.patch(
			'http://localhost:5000/user/addcart',
			{ cart },
			{
				headers: { Authorization: token, withCredentials: true },
			},
		);
	};

	const increment = async (id: string) => {
		cart?.forEach((item: { _id: string; quantity: number }) => {
			console.log(item, id);
			if (item._id === id) {
				item.quantity += 1;
			}
		});
		setCart && cart && setCart([...cart]);
		addToCart(cart);
	};

	const decrement = (id: string) => {
		cart?.forEach((item: { _id: string; quantity: number }) => {
			if (item._id === id) {
				item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
			}
		});
		setCart && cart && setCart([...cart]);
		addToCart(cart);
	};

	const removeProduct = async (id: string) => {
		const data = await Swal.fire(`Are you sure you want to remove this book?`);
		if (data.isConfirmed) {
			cart?.forEach(
				(
					item: {
						_id: string;
					},
					index,
				) => {
					if (item._id === id) {
						cart.splice(index, 1);
					}
				},
			);
			setCart && cart && setCart([...cart]);
			addToCart(cart);
		}
	};

	return (
		<div className='cart-item'>
			<div className='item-container'>
				<>
					<div className='item-img'>Book</div>
					<div className='item-name-details'>Title</div>
					<div className='price'>Price</div>
					<div className='quantity'>Quantity</div>
					<div className='total'>Total</div>
					<div className='total'>Remove Book</div>
				</>
				{cart?.map((item: ItemType, i) => (
					<React.Fragment key={i}>
						<div className='item-img'>
							<img src={item.images.url} alt={item.title} />
						</div>

						<div className='item-name-details'>
							<div className='item-title'>
								<p>{item?.title.substring(0, 15)}...</p>
							</div>
							<div className='item-authors'>
								{item?.authors.map(
									(author, i) => i < 1 && <p key={i}>by {author}</p>,
								)}
							</div>
							<div className='item-category'>
								<p>{item?.category}</p>
							</div>
						</div>

						<div className='price'>
							<p>&#x20B9;{item?.price}</p>
						</div>

						<div className='quantity'>
							<button onClick={() => decrement(item?._id)}>
								<RemoveCircleOutlineRoundedIcon />
							</button>
							<p>{item?.quantity}</p>
							<button onClick={() => increment(item?._id)}>
								<AddCircleOutlineRounded />
							</button>
						</div>

						<div className='total'>
							<p>&#x20B9;{item?.quantity * item?.price}</p>
						</div>

						<div className='remove-item'>
							<button onClick={() => removeProduct(item?._id)}>
								<CancelRounded />
							</button>
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export default CartItem;
