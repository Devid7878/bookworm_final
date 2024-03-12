import React, { ChangeEvent, useContext, useState } from 'react';
import './Order.css';
import { GlobalState } from '../../globalState/GlobalState';
function Orderr() {
	const state = useContext(GlobalState);
	const history = state?.userAPI.history;
	const updateHistory = state?.userAPI.updateHistory;

	console.log(history);

	const selectStatus = async (
		event: ChangeEvent<HTMLSelectElement>,
		id: string,
	) => {
		history?.forEach((item: { _id: string; status: string }) => {
			if (item._id === id) item.status = event.target.value;
		});

		updateHistory && updateHistory(event.target.value);
	};

	return (
		<div className='order-main-container'>
			<div className='order-container'>
				<div>Date</div>
				<div>Name</div>
				<div>Ordered Items</div>
				<div>Sale Amount</div>
				<div>Status</div>
			</div>
			{history?.map(
				(item: {
					_id: string;
					updatedAt: string;
					name: string;
					paymentID: string;
					cart: [];
					status: string;
				}) => (
					<div className='order-container' key={item._id}>
						<div className='date'>{item.updatedAt}</div>
						<div className='name'>{item.name}</div>
						<div className='cart-items'>
							{item.cart.map(
								(
									cartItem: {
										images: { url: string };
										title: string;
										quantity: number;
									},
									index,
								) => {
									return (
										<div key={index} className='flexrow'>
											<img
												src={cartItem.images.url}
												alt=''
												className='order__image'
											/>
											<p>
												{cartItem.title}({cartItem.quantity})
											</p>
										</div>
									);
								},
							)}
						</div>
						<div className='sale-amount'>
							&#x20B9;
							{item.cart.reduce(
								(
									prev,
									cartItem: {
										quantity: number;
										price: number;
									},
								) => prev + cartItem.quantity * cartItem.price,
								0,
							)}
						</div>
						<div className='status'>
							<select
								onChange={(event: ChangeEvent<HTMLSelectElement>) =>
									selectStatus(event, item._id)
								}>
								<option value='pending'>Pending</option>
								<option value='shipped'>Shipped</option>
							</select>
						</div>
					</div>
				),
			)}
		</div>
	);
}

export default Orderr;
