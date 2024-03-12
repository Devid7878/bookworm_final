import React, {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GlobalState } from './../../globalState/GlobalState';
import ProductItem from './ProductItem';
import Loading from './../Support/Loading';
import HeaderWithSearchBar from '../Header/HeaderWithSearchBar';
import { ArrowDropDownRounded, ArrowDropUpRounded } from '@mui/icons-material';
import './Products.css';
import axios from 'axios';

export default function Products() {
  const state = useContext(GlobalState);
  const categories = state?.categoriesAPI.categories;
  const products = state?.productsAPI.products;
  const setProducts = state?.productsAPI.setProducts;
  const setSelectedCategories = state?.productsAPI.setSelectedCategories;
  const selectedCategories = state?.productsAPI.selectedCategories;

  const setSort = state?.productsAPI.setSort;

  const [sortBy, setSortBy] = useState('');
  const [isDownArr, setIsDownArr] = useState(false);

  const handleCategoryFilter = async (
    e: MouseEvent<HTMLInputElement>,
    category: string
  ) => {
    setSelectedCategories &&
      setSelectedCategories((prevCategories) => {
        if (prevCategories.includes(category)) {
          // Category is already selected, remove it
          return prevCategories.filter((c) => c !== category);
        } else {
          // Category is not selected, add it
          return [...prevCategories, category];
        }
      });
  };

  useEffect(() => {
    setSelectedCategories &&
      selectedCategories &&
      setSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  return (
    <div className="main">
      <HeaderWithSearchBar />
      <div className="container">
        <div className="sort-by-container">
          <div className="sort-books">
            <select
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
        <div className="products__top">
          <div className="left">
            <h3>Filter By Categories</h3>
            <div className="filter-by">
              <div className="filter-by-category">
                {/* <div className="category-heading"> */}
                {/* <p>Categories</p>
                  <span
                    onClick={() => {
                      setIsDownArr((isDownArr) => !isDownArr);
                    }}
                  > */}
                {/* {!isDownArr ? (
                      <ArrowDropUpRounded
                        style={{ transform: 'rotate(90deg)' }}
                      />
                    ) : (
                      <ArrowDropDownRounded />
                    )}
                  </span> */}
                {/* </div> */}
                {/* {isDownArr && (
                  
                )} */}
                <div className="filter-by-category-modal">
                  <div className="categories">
                    {categories?.map((category, i) => (
                      <div className="categories-checking" key={i}>
                        <input
                          type="checkbox"
                          onClick={(event) => {
                            handleCategoryFilter(event, category?.name);
                          }}
                        />
                        <p>{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="products__container">
            <div className="products__main">
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
            </div>
            {/* <div className="button__seemore">
              {result && result > 0 ? (
                <button
                  onClick={() => {
                    if (setPage && page) setPage(page + 1);
                  }}
                >
                  See more
                </button>
              ) : (
                ''
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
