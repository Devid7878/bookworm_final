import React, { createContext, useState, useEffect, ReactNode } from 'react';
import ProductsAPI, { ProductsAPIType } from './../API/productsAPI';
import axios from 'axios';
import CategoriesAPI, { CategoriesAPIType } from './../API/categoriesAPI';
import UserAPI, { UserAPIType } from './../API/userAPI';

interface StatedData {
	token: string;
	setToken: React.Dispatch<React.SetStateAction<string>>;
	productsAPI: ProductsAPIType;
	categoriesAPI: CategoriesAPIType;
	userAPI: UserAPIType;
}

export const GlobalState = createContext<StatedData | undefined>(undefined);

interface DataProviderProps {
	children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const [token, setToken] = useState('');

	useEffect(() => {
		const login = localStorage.getItem('Login');
		if (login) {
			const refreshToken = async () => {
				try {
					const response = await axios.get(
						'http://localhost:5000/user/refresh_token',
						{
							withCredentials: true,
						},
					);

					console.log('REFRESHING THE REFRESH TOKEN...');
					setToken(response.data.accesstoken);
				} catch (error) {
					console.error('Error refreshing token:', error);
				}
			};
			refreshToken();
		}
	}, []);

	const statedData: StatedData = {
		token,
		setToken: setToken,
		productsAPI: ProductsAPI(),
		categoriesAPI: CategoriesAPI(),
		userAPI: UserAPI(token),
	};

	console.log('GLOBAL STATE RENDERED');

	return (
		<GlobalState.Provider value={statedData}>{children}</GlobalState.Provider>
	);
};
