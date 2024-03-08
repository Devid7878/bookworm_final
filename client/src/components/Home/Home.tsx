import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import Hero from './../../static/imgs/hero-img.png';
import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
      setIsLoading(false);
    }

    fetchProds();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="slogan">
          <h1>“The Magic of Books: Unleash Your Imagination.”</h1>
        </div>
        <div className="hero">
          <img src={Hero} alt="Hero Image" />
        </div>
      </div>
      {categories?.map((category) => (
        <div style={{ margin: '1rem 0' }}>
          <h1 style={{ textAlign: 'center' }}>
            {category.name}
            <hr />
          </h1>
          <div className="categories">
            {products.map((product, i) => {
              console.log(product, category);
              return (
                product.category.toLowerCase() ===
                  category.name.toLowerCase() && (
                  <Link
                    to={`/product/${product._id}`}
                    className="categories-book"
                  >
                    <img src={product.images.url} alt="category" />
                    <div className="categories-book-text">
                      <h1>{product.title}</h1>
                      <h5>${product.price}</h5>
                    </div>
                  </Link>
                )
              );
            })}
          </div>
        </div>
      ))}
      {/* <div className="categories-stack">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
    </>
  );
}

export default Home;
