import { GlobalState } from '../../globalState/GlobalState';
import { useContext, useState } from 'react';
// import CreateProduct from './createProduct/createProduct';
import Category from './Category/Category';
import SellerProductsList from './SellerProductsList';
import Order from './Order';
import Header from '../Header/Header';
import './Seller.css';

function Seller() {
	const state = useContext(GlobalState);
	const history = state?.userAPI.history;

	return (
		<div className='seller-main-container'>
			<Header />
			<div className='seller-inner-container'>
				<div className='seller-stats-container'>
					<div className='seller-sold-stats'>
						<div className='stats'>
							<p>Total Products Sold</p>
							<p>
								{history?.reduce(
									(
										prev,
										item: {
											cart: [];
										},
									) =>
										prev +
										item.cart.reduce(
											(prevItem, product: { sold: number }) =>
												prevItem + product.sold,
											0,
										),
									0,
								)}
							</p>
						</div>
					</div>
					{/* Recent Deposits */}

					<div className='seller-sold-stats'>
						<div className='stats'>
							<p>Total Revenue</p>
							<p className=''>
								&#x20B9;{' '}
								{history?.reduce(
									(prev, item: { cart: [] }) =>
										prev +
										item.cart.reduce(
											(
												prevItem,
												product: { quantity: number; price: number },
											) => prevItem + product.quantity * product.price,
											0,
										),
									0,
								)}
							</p>
						</div>
					</div>
				</div>

				{/* <Orders /> */}

				<div className='orders-container'>
					<h1>Orders</h1>
					<Order />
				</div>

				{/* category */}

				<div className='category-container'>
					<h1>Category</h1>
					<Category />
				</div>

				{/* product list */}
				<SellerProductsList />
			</div>
		</div>
	);
}

export default function Dashboard() {
	return <Seller />;
}
