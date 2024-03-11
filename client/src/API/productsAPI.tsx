import { useEffect, useState } from 'react';
import axios from 'axios';

export type ProductsAPIType = {
  // products: {}[];
  // result: number;
  // page: number;
  products: {
    product_id: string;
    _id: string;
    images: { url: string; public_id: string };
    title: string;
    category: string;
    price: number;
    description: string;
    content: string;
    sold: number;
    pageCount: number;
    isbn: string;
    authors: string[];
    checked: boolean;
  }[];
  setProducts: React.Dispatch<React.SetStateAction<[]>>;
  result: number;
  setResult: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  callback: boolean;
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductsAPI() {
  const [products, setProducts] = useState<any>([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('checked');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(['']);

  useEffect(() => {
    console.log('PRODUCTS API EFFECT');
    const getProducts = async () => {
      // let link = `http://localhost:5000/api/products?&sort=${sort}&limit=${
      // 	page * 6
      // }&${category}&titleLowerCase[regex]=${search.toLowerCase()}`;

      const categoryParam = selectedCategories.length
        ? `${selectedCategories.join('&category=')}`
        : '';

      let link = `http://localhost:5000/api/products?&sort=${sort}&${categoryParam}&titleLowerCase[regex]=${search.toLowerCase()}`;

      console.log(link);
      const response = await axios.get(link);
      setProducts(response.data.products);
      setResult(response.data.result);
    };
    getProducts();
  }, [category, page, sort, search, callback, selectedCategories]);

  return {
    products,
    setProducts,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    callback,
    setCallback,
    page,
    setPage,
    result,
    setResult,
    selectedCategories,
    setSelectedCategories,
  };
}
