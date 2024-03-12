import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { GlobalState } from './../../globalState/GlobalState';
import './ProductDetails.css';
import Header from '../Header/Header';

export default function ProductDetail() {
	const state = useContext(GlobalState);
	const products = state?.productsAPI.products;
	const addCart = state?.userAPI.addCart;
	const isLogged = state?.userAPI.isLogged;

	const [productDetail, setProductDetail] = useState({
		_id: '',
		images: { url: '' },
		title: '',
		category: '',
		price: 0,
		description: '',
		content: '',
		authors: [''],
	});
	const params = useParams();

	useEffect(() => {
		if (params.id) {
			products?.forEach((product) => {
				if (product._id === params.id) {
					setProductDetail(product);
				}
			});
		}
	}, [params.id, products]);

	const addToCart = () => {
		if (isLogged) {
			if (addCart) addCart(productDetail);
		} else {
			Swal.fire('Fail!', 'Please login to be able to shop', 'error');
		}
	};

	if (Object.keys(productDetail).length === 0) return null;
	
	return (
		<div className='main'>
			<Header />
			<div className='detail__container'>
				{' '}
				<div className='detail__image--container'>
					<img
						src={productDetail.images.url}
						alt={productDetail.title}
						className='detail__image'
					/>
				</div>
				<div className='detail__content--container'>
					<div className='detail__content'>
						<h1 className='product__detail--title'>{productDetail.title}</h1>
						<h2>Price: &#x20B9;{productDetail.price}</h2>
						<div className='description'>
							<span>Description</span>
							<p>{productDetail.description}</p>
						</div>
						<p>Author: {productDetail.authors.map((author) => author)}</p>
						<p className='product__detail--title'>
							Category: {productDetail.category}
						</p>
						<button className='add-to-cart' onClick={addToCart}>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
