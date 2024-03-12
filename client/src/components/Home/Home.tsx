import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import Hero from './../../static/imgs/hero-img.png';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
function Home() {
  const state = useContext(GlobalState);
  const categories = state?.categoriesAPI.categories;

  const [products, setProducts] = useState<
    {
      _id: string;
      images: { url: string };
      title: string;
      price: number;
      category: string;
      authors: string[];
      checked: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProds() {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products);
      setIsLoading(false);
    }

    fetchProds();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="slogan">
          <h1>
            <span>BOOKS </span>: Unleash Your Imagination!
          </h1>
        </div>
        <div className="hero">
          <img src={Hero} alt="Hero" />
        </div>
      </div>
      {categories?.map(
        (category, i) =>
          i < 3 && (
            <div key={i}>
              <p className="category-title">{category.name}</p>
              <div className="categories">
                {products.map((product, idx) => {
                  return (
										product.checked &&
										product.category.toLowerCase() ===
											category.name.toLowerCase() && (
											<div className='product' key={idx}>
												<Link
													to={`/product/${product._id}`}
													className='categories-book'>
													<div className='img-container'>
														<img src={product.images.url} alt='category' />
													</div>
													<div className='categories-book-text'>
														<h1>{product.title.substring(0, 20)}...</h1>
														{product.authors.map(
															(a, i) => i < 1 && <p key={i}>by {a}</p>,
														)}
														<h5>&#x20B9;{product.price}</h5>
													</div>
												</Link>
											</div>
										)
									);
                })}
              </div>
            </div>
          )
      )}
      <Footer />
    </>
  );
}

export default Home;
