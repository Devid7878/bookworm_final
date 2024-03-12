import { Button } from '@mui/material';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { GlobalState } from './../../globalState/GlobalState';
import { Link, NavLink } from 'react-router-dom';
import './ProductItem.css';
//
export default function ProductItem({
  product,
}: {
  product: {
    _id: string;
    images: {
      url: string;
    };
    title: string;
    price: number;
    authors: string[];
  };
}) {
  const state = useContext(GlobalState);
  const addCart = state?.userAPI.addCart;

  const isLogged = state?.userAPI.isLogged;

  // const logged = localStorage.getItem('Login');

  const addToCart = () => {
    if (isLogged) {
      addCart && addCart(product);
    } else {
      Swal.fire('Fail', 'Please login to be able to shop', 'error');
    }
  };

  return (
		<div className='product__container'>
			<div className='product__overlay'>
				<NavLink to={`/product/${product._id}`}>
					<div className='product__image--container'>
						<img src={product.images.url} alt={product.title} />
					</div>
					<div className='product__content--container'>
						<div className='product__content'>
							{product.title.length > 20 ? (
								<p>{product.title.substring(0, 26)}...</p>
							) : (
								<p>{product.title}</p>
							)}
							<p>
								by{' '}
								{product.authors.map(
									(author, i) =>
										i < 1 && <span key={i}>{author.substring(0, 10)}...</span>,
								)}
							</p>
							<p>Price: &#x20B9;{product.price}</p>
						</div>
					</div>
				</NavLink>
				<div className='product__btn'>
					<button className='addCart__btn' onClick={addToCart}>
						Add to cart
					</button>
				</div>
			</div>
		</div>
	);
}
