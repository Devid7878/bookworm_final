import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './ListItems';
import Orders from './Orders';
import { GlobalState } from '../../globalState/GlobalState';
import { useContext, useState } from 'react';
// import CreateProduct from './createProduct/createProduct';
import Category from './Category/Category';
import SellerProductsList from './SellerProductsList';
import Orderr from './Orderr';
import Header from '../Header/Header';
import './Seller.css';

function Seller() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const state = useContext(GlobalState);
  const history = state?.userAPI.history;

  return (
    <div className="seller-main-container">
      <Header />
      <div className="seller-inner-container">
        <div className="seller-stats-container">
          <div className="seller-sold-stats">
            <div className="stats">
              <p>Total Products Sold</p>
              <p>
                {history?.reduce(
                  (
                    prev,
                    item: {
                      cart: [];
                    }
                  ) =>
                    prev +
                    item.cart.reduce(
                      (prevItem, product: { sold: number }) =>
                        prevItem + product.sold,
                      0
                    ),
                  0
                )}
                N
              </p>
            </div>
          </div>
          {/* Recent Deposits */}

          <div className="seller-sold-stats">
            <div className="stats">
              <p>Total Revenue</p>
              <p className="">
                ${' '}
                {history?.reduce(
                  (prev, item: { cart: [] }) =>
                    prev +
                    item.cart.reduce(
                      (
                        prevItem,
                        product: { quantity: number; price: number }
                      ) => prevItem + product.quantity * product.price,
                      0
                    ),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* <Orders /> */}

        <div className="orders-container">
          <h1>Orders</h1>
          <Orderr />
        </div>

        {/* category */}

        <div className="category-container">
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
