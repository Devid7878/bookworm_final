import * as React from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useContext, useState } from 'react';
import { GlobalState } from '../../globalState/GlobalState';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
// import PaypalButton from './PaypalButton';
import Grid from '@mui/material/Grid';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [address, setAddress] = useState('');
  const state = useContext(GlobalState);
  const cart = state?.userAPI.cart;
  const setCart = state?.userAPI.setCart;
  const token = state?.token;
  const callback = state?.userAPI.callback;
  const setCallback = state?.userAPI.setCallback;

  // const [cart, setCart] = useState([]);

  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  console.log(cart);

  useEffect(() => {
    const totalCost = () => {
      let total = cart?.reduce(
        (prev, item: { price: number; quantity: number }) => {
          return prev + item.price * item.quantity;
        },
        0
      );

      total && setTotal(total);
    };
    totalCost();
  }, [cart]);

  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:5000/user/infor', {
  //         headers: {
  //           Authorization: token,
  //           withCredentials: true,
  //         },
  //       });

  //       console.log(res);
  //       setCart && setCart(res.data.cart);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchCart();
  // }, []);

  const addToCart = async (cart: any) => {
    await axios.patch(
      'http://localhost:5000/user/addcart',
      { cart },
      {
        headers: { Authorization: token, withCredentials: true },
      }
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

  const removeProduct = (id: string) => {
    if (window.confirm('Do you want to delete this product?')) {
      cart?.forEach(
        (
          item: {
            _id: string;
          },
          index
        ) => {
          if (item._id === id) {
            cart.splice(index, 1);
          }
        }
      );
      setCart && cart && setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async (payment: { address: string }) => {
    const { address } = payment;
    const res = await axios.post(
      `http://localhost:5000/api/payment`,
      { cart, address },
      {
        headers: { Authorization: token },
      }
    );

    console.log(res);
    setCart && setCart([]);
    addToCart([]);
    Swal.fire('Success!', 'Thank you for purchase!', 'success');
    setCallback && setCallback(!callback);
  };

  return (
    <div className="main">
      <div className="container">
        <div className="cart__container">
          <h1 className="page__header">Cart</h1>
          {cart && cart.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table__item">Name</TableCell>
                    <TableCell className="table__item" align="left">
                      Image
                    </TableCell>
                    <TableCell className="table__item">Category</TableCell>
                    <TableCell className="table__item">Price</TableCell>
                    <TableCell className="table__item">Quantity</TableCell>
                    <TableCell
                      className="table__item"
                      align="right"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart?.map(
                    (item: {
                      _id: string;
                      title: string;
                      images: { url: string };
                      category: string;
                      price: number;
                      quantity: number;
                    }) => (
                      <TableRow
                        key={item._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        {item.title.length > 40 ? (
                          <TableCell
                            className="table__item"
                            component="th"
                            scope="row"
                          >
                            {item.title.substring(0, 40)}...
                          </TableCell>
                        ) : (
                          <TableCell
                            className="table__item"
                            component="th"
                            scope="row"
                          >
                            {item.title}
                          </TableCell>
                        )}

                        <TableCell className="table__item">
                          <img
                            src={item.images.url}
                            alt={item.title}
                            className="cart__image"
                          />
                        </TableCell>
                        <TableCell className="table__item">
                          {item.category}
                        </TableCell>
                        <TableCell className="table__item">
                          ${item.price}
                        </TableCell>
                        <TableCell className="table__item">
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <button
                              className="table__cart--button"
                              onClick={() => decrement(item._id)}
                            >
                              -
                            </button>
                            &nbsp;
                            {item.quantity}
                            &nbsp;
                            <button
                              className="table__cart--button"
                              onClick={() => increment(item._id)}
                            >
                              +
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="table__item" align="right">
                          <Button
                            className="cart__remove--btn"
                            variant="contained"
                            color="success"
                            onClick={() => removeProduct(item._id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}

                  <TableRow>
                    <TableCell className="table__item" colSpan={2}>
                      Total
                    </TableCell>
                    <TableCell
                      className="table__item total__price"
                      align="right"
                    >
                      <strong>${Math.round(total * 1000) / 1000}</strong>
                    </TableCell>
                    <TableCell
                      className="table__item"
                      align="right"
                    ></TableCell>
                    <TableCell
                      className="table__item"
                      align="right"
                    ></TableCell>
                    <TableCell className="table__item" align="right">
                      {/* <PaypalButton
                        total={total}
                        tranSuccess={tranSuccess}
                        className="paypal__button"
                      /> */}
                      <input
                        type="text"
                        className=""
                        placeholder="Address"
                        value={address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAddress(e.target.value)
                        }
                      />
                      <button onClick={() => tranSuccess({ address })}>
                        Checkout
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 300,
                }}
              >
                <h2>No Cart Item</h2>
              </Paper>
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
}
