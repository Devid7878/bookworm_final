import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { GlobalState } from './../../../globalState/GlobalState';
import { Button } from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Category.css';
import Header from '../../Header/Header';

export default function Category() {
  const state = React.useContext(GlobalState);
  const categories = state?.categoriesAPI.categories;
  const setCategories = state?.categoriesAPI.setCategories;
  const token = state?.token;
  const callback = state?.userAPI.callback;
  const setCallback = state?.userAPI.setCallback;
  const isSeller = state?.userAPI.isSeller;

  const [category, setCategory] = useState('');
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState('');

  const headers = {
    Authorization: '',
  };
  const createCategory = async () => {
    try {
      if (token) {
        headers.Authorization = token;
      }

      if (!isSeller) return Swal.fire('Error', 'You are not Authorized!');

      if (edit) {
        const response = await axios.put(
          `http://localhost:5000/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token, withCredentials: true },
          }
        );

        setCategories &&
          setCategories((categories) =>
            categories?.map((category) =>
              category._id === id
                ? { ...category, name: response.data.category.name }
                : category
            )
          );

        Swal.fire('Success!', response.data.msg, 'success');
      } else {
        const response = await axios.post(
          `http://localhost:5000/api/category`,
          { name: category },
          {
            headers: { Authorization: token, withCredentials: true },
          }
        );
        console.log(response);
        setCategories &&
          setCategories((categories) => [
            ...categories,
            response.data.category,
          ]);
        Swal.fire('Success!', response.data.msg, 'success');
      }
      if (setCallback) setCallback(!callback);

      setEdit(false);

      setCategory('');
    } catch (err: any) {
      Swal.fire('Error', err.response.data.msg);
    }
  };

  const editCategory = (id: string, name: string) => {
    setEdit(true);
    setId(id);
    setCategory(name);
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/category/${id}`,
        {
          headers: { Authorization: token, withCredentials: true },
        }
      );
      Swal.fire('Success!', 'Category deleted!');

      const filteredCategories = categories?.filter(
        (category) => category._id !== id
      );

      setCategories && filteredCategories && setCategories(filteredCategories);
    } catch (err: any) {
      Swal.fire('Error', err.response.data.msg, 'error');
    }
  };

  return (
    <div className="order__item">
      <div className="create-category">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          <span>Create Category: </span>
          <input
            type="text"
            name="category"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter your category..."
            style={{ fontSize: '20px' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="create__category--btn"
          style={{ maxWidth: '10%', fontSize: '15px' }}
          onClick={createCategory}
        >
          {edit ? 'UPDATE' : 'CREATE'}
        </button>
      </div>
      <div className="categories-table">
        <h2>Categories Table</h2>
        <div className="category-table">
          <div className="category-table-header">
            <div className="order__item">Name</div>
            <div className="order__item">Create At</div>
            <div className="order__item">Update At</div>
            <div className="order__item">Action</div>
          </div>
          {categories?.map((item) => (
            <div key={item._id} className="category-table-body">
              <div className="order__item">{item.name}</div>
              <div className="order__item">{item.createdAt}</div>
              <div className="order__item">{item.updatedAt}</div>
              <div className="order__item flexrow">
                <button
                  className="edit-btn-category"
                  onClick={() => editCategory(item._id, item.name)}
                >
                  Edit
                </button>
                &nbsp;
                <button
                  className="delete-btn-category"
                  onClick={() => deleteCategory(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
