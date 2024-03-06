import React, { createContext, useState, useEffect, ReactNode } from 'react';
import ProductsAPI, { ProductsAPIType } from './../API/productsAPI'; // Replace 'ProductsAPIType' with your actual type if available
import axios from 'axios';
import CategoriesAPI, { CategoriesAPIType } from './../API/categoriesAPI'; // Replace 'CategoriesAPIType' with your actual type if available
import UserAPI, { UserAPIType } from './../API/userAPI'; // Replace 'UserAPIType' with your actual type if available

interface StatedData {
  // token: [string, React.Dispatch<React.SetStateAction<string>>];
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  productsAPI: ProductsAPIType; // Replace 'ProductsAPIType' with your actual type if available
  categoriesAPI: CategoriesAPIType; // Replace 'CategoriesAPIType' with your actual type if available
  userAPI: UserAPIType; // Replace 'UserAPIType' with your actual type if available
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
      console.log('REFRESH');
      const refreshToken = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/user/refresh_token',
            {
              withCredentials: true,
            }
          );

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

  return (
    <GlobalState.Provider value={statedData}>{children}</GlobalState.Provider>
  );
};
