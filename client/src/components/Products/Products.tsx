import React, { useContext } from 'react';
import { GlobalState } from './../../globalState/GlobalState';
import ProductItem from './ProductItem';
import { Button } from '@mui/material';
import Loading from './../Support/Loading';
// import Categories from "../filter/Category"
import './Products.css';

export default function Products() {
  const state = useContext(GlobalState);
  const products = state?.productsAPI.products;
  const result = state?.productsAPI.result;
  const page = state?.productsAPI.page;
  const setPage = state?.productsAPI.setPage;

  return (
    <div className="main">
      <div className="container">
        <h2 className="page__header">Products</h2>
        <div>{/* <Categories /> */}</div>
        <div className="container__item">
          {products && products.length > 0 ? (
            <div className="product__home--container">
              {products.map((product) => {
                return <ProductItem key={product._id} product={product} />;
              })}
            </div>
          ) : (
            <Loading />
          )}
          <div className="button__seemore">
            {result && result > 0 ? (
              ''
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  if (setPage && page) setPage(page + 1);
                }}
              >
                See more
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
