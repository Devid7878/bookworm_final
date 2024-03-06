import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export type UserAPIType = {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState<any>([]);
  const [history, setHistory] = useState<any>([]);
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

          setIsLogged(true);
          response.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

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
        console.log(isAdmin);
        if (isAdmin) {
          const response = await axios.get(
            `http://localhost:5000/api/payment`,
            {
              headers: { Authorization: token, withCredentials: true },
            }
          );
          setHistory(response.data);
        } else {
          const response = await axios.get(
            `http://localhost:5000/user/history`,
            {
              headers: { Authorization: token, withCredentials: true },
            }
          );
          setHistory(response.data);
          console.log(response);
        }
      };
      getHistory();
    }
  }, [token, isAdmin]);

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
        }
      );

      Swal.fire(
        'Thank you!',
        'This product has been added to cart!',
        'success'
      );
    } else {
      Swal.fire('Thank you!', 'This product is already in your cart!', 'info');
    }
  };

  return {
    addCart,
    isLogged,
    setIsLogged,
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
    // isAdmin: [isAdmin, setIsAdmin],
    // callback: [callback, setCallback],
    // history: [history, setHistory],
    // infor: [infor, setInfor],
    // cart: [cart, setCart],
  };
}
