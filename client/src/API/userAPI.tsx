import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { GlobalState } from '../globalState/GlobalState';

export type UserAPIType = {
	isLogged: boolean;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
	isSeller: boolean;
	setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
	isAdmin: boolean;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
	callback: boolean;
	setCallback: React.Dispatch<React.SetStateAction<boolean>>;
	history: [];
	setHistory: React.Dispatch<React.SetStateAction<[]>>;
	infor: [];
	setInfor: React.Dispatch<React.SetStateAction<[]>>;
	cart: [];
	setCart: React.Dispatch<React.SetStateAction<[]>>;
	addCart: (p: ProductType) => Promise<any>;
};

type ProductType = {
	_id: string;
};

export default function UserAPI(token: string) {
	const [isLogged, setIsLogged] = useState(false);
	const [isSeller, setIsSeller] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [cart, setCart] = useState<any>([]);
	const [history, setHistory] = useState<[]>([]);
	const [callback, setCallback] = useState(false);
	const [infor, setInfor] = useState<any>([]);

	// const loggedIn = localStorage.getItem('Login');

	// const token = localStorage.getItem('token');
	useEffect(() => {
		if (token) {
			const getUser = async () => {
				try {
					const response = await axios.get(`http://localhost:5000/user/infor`, {
						headers: { Authorization: token, withCredentials: true },
					});

					// response.data.role === 1 ? setIsSeller(true) : setIsSeller(false);

					if (response.data.role === 1) {
						setIsSeller(true);
						setIsAdmin(false);
					} else if (response.data.role === 2) {
						setIsSeller(false);
						setIsAdmin(true);
					} else {
						setIsSeller(false);
						setIsAdmin(false);
					}

					setIsLogged(true);
					setCart(response.data.cart);
					setInfor([
						response.data.name,
						response.data.mobile,
						response.data.address,
					]);
				} catch (err: any) {
					Swal.fire('Error', err.response.data.msg, 'error');
				}
			};
			getUser();
		}
	}, [token]);

	useEffect(() => {
		if (token) {
			const getHistory = async () => {
				if (isSeller) {
					const response = await axios.get(
						`http://localhost:5000/api/payment`,
						{
							headers: { Authorization: token, withCredentials: true },
						},
					);
					setHistory(response.data);
				} else {
					const response = await axios.get(
						`http://localhost:5000/user/history`,
						{
							headers: { Authorization: token, withCredentials: true },
						},
					);
					setHistory(response.data);
				}
			};
			getHistory();
		}
	}, [token, isSeller, isAdmin]);

	const addCart = async (product: ProductType) => {
		// if (!isLogged) {
		//   Swal.fire('Fail!', 'Please login to be able to shop', 'error');
		// }
		if (!isLogged) {
			Swal.fire('Fail!', 'Please login to be able to shop', 'error');
		}

		const check = cart.every((item: { _id: string }) => {
			return item._id !== product._id;
		});

		if (check) {
			setCart([...cart, { ...product, quantity: 1 }]);

			await axios.patch(
				'http://localhost:5000/user/addcart',
				{ cart: [...cart, { ...product, quantity: 1 }] },
				{
					headers: { Authorization: token, withCredentials: true },
				},
			);

			Swal.fire(
				'Thank you!',
				'This product has been added to cart!',
				'success',
			);
		} else {
			Swal.fire('Thank you!', 'This product is already in your cart!', 'info');
		}
	};

	return {
		addCart,
		isLogged,
		setIsLogged,
		isSeller,
		setIsSeller,
		isAdmin,
		setIsAdmin,
		callback,
		setCallback,
		history,
		setHistory,
		infor,
		setInfor,
		cart,
		setCart,
		// isSeller: [isSeller, setIsSeller],
		// callback: [callback, setCallback],
		// history: [history, setHistory],
		// infor: [infor, setInfor],
		// cart: [cart, setCart],
	};
}
