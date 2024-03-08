import React, { ChangeEvent, useContext, useState } from 'react';
import { GlobalState } from './../../globalState/GlobalState';
import ProductItem from './ProductItem';
import { Button } from '@mui/material';
import Loading from './../Support/Loading';
import './Products.css';
import Header from '../Header/Header';

export default function Products() {
  const state = useContext(GlobalState);
  const products = state?.productsAPI.products;
  const result = state?.productsAPI.result;
  const page = state?.productsAPI.page;
  const setSort = state?.productsAPI.setSort;
  const setPage = state?.productsAPI.setPage;

  const [sortBy, setSortBy] = useState('');

  return (
    <div className="main">
      <Header />
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 className="page__header">Products</h2>
          <div>
            <select
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                console.log();
                setSortBy(e.target.value);
                setSort && setSort(e.target.value);
              }}
            >
              <option value="none">Sort By</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-publishedDate">Newest</option>
            </select>
          </div>
        </div>
        <div className="container__item">
          {products && (
            <div className="product__home--container">
              {products.map((product) => {
                return (
                  product.checked && (
                    <ProductItem key={product._id} product={product} />
                  )
                );
              })}
            </div>
          )}
          <div className="button__seemore">
            {result && result > 0 ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  if (setPage && page) setPage(page + 1);
                }}
              >
                See more
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
