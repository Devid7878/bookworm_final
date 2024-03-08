import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { GlobalState } from './../../../globalState/GlobalState';
import { Button } from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

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
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Category: &nbsp;&nbsp;&nbsp;&nbsp;
        </label>
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
        <button
          type="submit"
          className="create__category--btn"
          style={{ maxWidth: '10%', fontSize: '15px' }}
          onClick={createCategory}
        >
          {edit ? 'UPDATE' : 'CREATE'}
        </button>
      </div>
      <div>
        <React.Fragment>
          <h2>Categories Table</h2>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell className="order__item">Name</TableCell>
                <TableCell className="order__item">Create At</TableCell>
                <TableCell className="order__item">Update At</TableCell>
                <TableCell className="order__item">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="order__item">{item.name}</TableCell>
                  <TableCell className="order__item">
                    {item.createdAt}
                  </TableCell>
                  <TableCell className="order__item">
                    {item.updatedAt}
                  </TableCell>
                  <TableCell className="order__item flexrow">
                    <Button
                      className="admin__btn"
                      variant="contained"
                      color="primary"
                      onClick={() => editCategory(item._id, item.name)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      className="admin__btn"
                      variant="contained"
                      color="primary"
                      onClick={() => deleteCategory(item._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      </div>
    </div>
  );
}
