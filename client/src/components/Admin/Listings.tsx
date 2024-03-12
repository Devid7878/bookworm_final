import React, { useContext, useEffect, useState } from 'react';

import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import Loading from '../Support/Loading';
import Header from '../Header/Header';

import './Listings.css';

function Listings() {
  const state = useContext(GlobalState);
  //   const products = state?.productsAPI.products;
  const token = state?.token;

  const [products, setProducts] = useState<
    {
      _id: string;
      images: { url: string };
      title: string;
      price: number;
      category: string;
      authors: string;
      checked: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProds() {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products);
      console.log(res.data.products);
      setIsLoading(false);
    }

    fetchProds();
  }, [setProducts]);

  const nonCheckedProds = products?.map((product) =>
    !product.checked ? product : null
  );

  const approveOrRejectHandler = async (
    action: string,
    product: { _id: string; checked: boolean }
  ) => {
    if (action === 'approve') {
      setIsLoading(true);
      await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        { ...product, checked: true },
        {
          headers: {
            Authorization: token,
            withCredentials: true,
          },
        }
      );
      const updatedList = products?.map((p) =>
        p._id === product._id ? { ...p, checked: true } : p
      );

      setIsLoading(false);
      console.log(updatedList);
      setProducts(updatedList);
    }
    if (action === 'reject') {
      await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      });
      const updatedList = products?.filter((p) => p._id !== product._id);
      setProducts(updatedList);
    }
  };

  return (
		<>
			<div className='container'>
				<Header />
				<div className='table'>
					<div className='title'>Title</div>
					<div className='price'>Price</div>
					<div className='category'>Category</div>
					<div className='authors'>Authors</div>
					<div className='app-rej'>Approve/Reject</div>
				</div>
				{isLoading ? (
					<Loading />
				) : (
					nonCheckedProds?.map(
						(product) =>
							product && (
								<div key={product?.title} className='tbody'>
									<div className='title'>
										<img src={product?.images.url} alt='' />
										<p>{product?.title}</p>
									</div>
									<div className='price'>
										<p>&#x20B9;{product?.price}</p>
									</div>
									<div className='category'>
										<p>{product?.category}</p>
									</div>
									<div className='authors'>
										<p>{product?.authors}</p>
									</div>
									<div className='app-rej'>
										<button
											onClick={() =>
												approveOrRejectHandler('approve', product)
											}>
											Approve
										</button>
										<button
											onClick={() => approveOrRejectHandler('reject', product)}>
											Reject
										</button>
									</div>
								</div>
							),
					)
				)}
			</div>
		</>
	);
}
export default Listings;
