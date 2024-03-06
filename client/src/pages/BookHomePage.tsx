import { useContext } from 'react';
import { GlobalState } from './../globalState/GlobalState';
import Banner from '../components/Banner/Banner';
import ProductItem from '../components/Products/ProductItem';
import { Button } from '@mui/material';
import Loading from './../components/Support/Loading';
import Advertise from './../components/Ads/Ads';

interface ProductType {
  _id: string;
  images: { url: string };
  title: string;
  price: number;
  // Add more properties as needed
}

export default function ProductHome() {
  const state = useContext(GlobalState);

  const products = state?.productsAPI.products;
  const result = state?.productsAPI.result;
  const page = state?.productsAPI.page;
  const setPage = state?.productsAPI.setPage;

  if (products?.length === 0) return null;
  console.log(products);

  return (
    <div className="main">
      <div className="container">
        <div>{/* <Banner /> */}</div>
        <div className="container__item">
          {products?.length && products.length > 0 ? (
            <div className="product__home--container">
              {products.map((product) => {
                return <ProductItem product={product} />;
              })}
            </div>
          ) : (
            // <Loading />
            <h1>No Products Found</h1>
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
        <div>{/* <Advertise /> */}</div>
      </div>
    </div>
  );
}
