import React, { useContext } from 'react';

import './History.css';
import Header from '../Header/Header';
import { GlobalState } from '../../globalState/GlobalState';

type HistoryType = {
  _id: string;
  name: string;
  email: string;
  address: {
    address_line1: string;
    address_line2: string;
  };
  cart: {
    title: string;
    quantity: number;
    price: number;
    images: {
      url: '';
    };
  }[];
};

function History() {
  const state = useContext(GlobalState);
  const history = state?.userAPI.history;
  console.log(history);

  return (
		<div className='history-main-container'>
			<Header />
			<div className='table-container'>
				<div className='history-table-header'>
					<div>Order_id</div>
					<div>Ordered by</div>
					<div>Shipping Address</div>
					<div>Order</div>
					<div>Total Amount</div>
				</div>
				<div className='history-table-main'>
					{history?.map((h: HistoryType) => (
						<>
							<div>
								<p>{h._id}</p>
							</div>
							<div>
								<p>{h.name}</p>
								<p>{h.email}</p>
							</div>
							<div>
								<p>{h.address.address_line1}</p>
								<p>{h.address.address_line2}</p>
							</div>
							<div>
								{h.cart.map((c, i) => (
									<div key={i} className='history-cart-item'>
										<img src={c?.images?.url} alt='' />
										<p>
											({c.quantity}){c.title.substring(0, 15)}...
										</p>
									</div>
								))}
							</div>
							<div>
								<p>
									&#x20B9;
									{h.cart.reduce(
										(prev, cartItem) =>
											prev + cartItem.quantity * cartItem.price,
										0,
									)}
								</p>
							</div>
						</>
					))}
				</div>
			</div>
		</div>
	);
}

export default History;
