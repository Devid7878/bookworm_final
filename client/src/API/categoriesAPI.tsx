import { useEffect, useState } from 'react';
import axios from 'axios';

export type CategoriesAPIType = {
  categories: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  setCategories: React.Dispatch<
    React.SetStateAction<
      { _id: string; name: string; createdAt: string; updatedAt: string }[]
    >
  >;
  callback: boolean;
  setCallback: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CategoriesAPI() {
  const [categories, setCategories] = useState<any>([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(`http://localhost:5000/api/category`, {
        headers: { withCredentials: true },
      });
      setCategories(response.data);
    };
    getCategories();
  }, [callback]);
  return {
    categories,
    setCategories,
    callback,
    setCallback,
    // categories: [categories, setCategories],
    // callback: [callback, setCallback],
  };
}
