import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../globalState/GlobalState';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import Loading from './../Support/Loading';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

let initialState = {
  product_id: '',
  title: '',
  price: 0,
  description: '',
  content: '',
  category: '',
  _id: '',
  images: {
    url: '',
  },
  pageCount: 0,
  isbn: '',
  sold: 0,
  authors: [''],
};

export default function SellerProductsList() {
  const state = useContext(GlobalState);
  const products = state?.productsAPI.products;
  const callback = state?.productsAPI.callback;
  const setCallback = state?.productsAPI.setCallback;
  const categories = state?.categoriesAPI.categories;
  const page = state?.productsAPI.page;
  const setPage = state?.productsAPI.setPage;
  const isSeller = state?.userAPI.isSeller;
  const token = state?.token;

  const [product, setProduct] = useState(initialState);
  const [onEdit, setOnEdit] = useState(false);
  const [images, setImages] = useState({ url: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setPage && setPage(5);
  }, [page, setPage]);

  useEffect(() => {
    if (params.id) {
      setOnEdit(true);
      products?.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages({ url: '' });
    }
  }, [params, product.images, products]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (!isSeller) {
        Swal.fire('You are not admin!', 'error');
      }
      const file = e.target.files && e.target?.files[0];
      console.log(file);
      if (!file) return Swal.fire('File not exist');
      if (file.size > 1024 * 1024)
        return Swal.fire('File format is incorrect.');

      let formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/api/upload`,
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: token,
            withCredentials: true,
          },
        }
      );
      setLoading(false);
      setImages(response.data);
    } catch (err: any) {
      Swal.fire(err.response.data.msg);
    }
  };

  const handleChangeInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // const handleDestroy = async () => {
  //   try {
  //     setLoading(true);
  //     if (!isSeller) return Swal.fire("You're not an admin");
  //     setLoading(true);
  //     await axios.post(
  //       '/api/destroy',
  //       { public_id: images.public_id },
  //       {
  //         headers: {
  //           Authorization: token,
  //           withCredentials: true,
  //         },
  //       }
  //     );
  //     setImages({ url: '', public_id: '' });
  //     setLoading(false);
  //   } catch (err: any) {
  //     Swal.fire(err.response.data.msg);
  //   }
  // };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (!isSeller) return Swal.fire("You're not an admin");
      if (!images) return Swal.fire('No images upload');

      if (onEdit) {
        await axios.put(
          `http://localhost:5000/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token, withCredentials: true },
          }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/products`,
          {
            ...product,
            images,
          },
          {
            headers: {
              Authorization: token,
              withCredentials: true,
            },
          }
        );
      }
      setCallback && setCallback(!callback);
      navigate('/seller');
    } catch (err: any) {
      Swal.fire('Error', err.response.msg, 'error');
    }
  };

  const deleteProduct = async (id: string, public_id: string) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        `/api/destroy`,
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProduct;
      setLoading(false);
      setCallback && setCallback(!callback);
      navigate('/admin');
    } catch (err: any) {
      Swal.fire('Error', err.response.data.msg, 'error');
    }
  };

  if (loading)
    return (
      <div className="admin__loading">
        <Loading />
      </div>
    );

  const styleImage = {
    display: images ? 'block' : 'none',
  };

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <h2 className="page__header">Create Products</h2>
        <Paper
          sx={{
            // p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            // height: '600px',
            maxWidth: onEdit ? '1200px' : 'auto',
          }}
        >
          <Grid item xs={12} md={5} lg={5}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
              }}
            >
              <div className="upload__file--container">
                <input
                  type="file"
                  name="file"
                  className="form-control-file"
                  id="file__upload"
                  onChange={handleUpload}
                />
                {loading ? (
                  <div id="file__images--container">
                    <Loading />
                  </div>
                ) : (
                  <div className="file__image--container" style={styleImage}>
                    <img
                      src={images ? images.url : ''}
                      alt=""
                      id="file__image"
                    />
                    <i
                      className="far fa-times-circle"
                      // onClick={handleDestroy}
                    ></i>
                  </div>
                )}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="update__content">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="productID">ISBN of book</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="product_id"
                      className="form-control create__product--input"
                      id="product_id"
                      placeholder="ISBN of a Book"
                      disabled={onEdit}
                      value={product.product_id}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="title"
                      className="form-control create__product--input"
                      id="title"
                      placeholder="Title..."
                      value={product.title}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="price"
                      className="form-control create__product--input"
                      id="price"
                      placeholder="Price..."
                      value={product.price}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="description"
                      className="form-control create__product--input"
                      id="description"
                      placeholder="Description..."
                      value={product.description}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pageCount">No of pages</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="pageCount"
                      className="form-control create__product--input"
                      id="pageCount"
                      placeholder="Page Count..."
                      value={product.pageCount}
                      onChange={handleChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="authors">Authors</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="authors"
                      className="form-control create__product--input"
                      id="authors"
                      placeholder="Author"
                      value={product.authors}
                      onChange={handleChangeInput}
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="isbn">ISBN of book</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="isbn"
                      className="form-control create__product--input"
                      id="isbn"
                      placeholder="ISBN of Book"
                      value={product.isbn}
                      onChange={handleChangeInput}
                    />
                  </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="content">Content</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <textarea
                      name="content"
                      className="form-control create__product--input"
                      id="content"
                      rows={3}
                      value={product.content}
                      onChange={handleChangeInput}
                    ></textarea>
                  </div> */}
                  <select
                    name="category"
                    className="form-control create__product--input"
                    value={product.category}
                    onChange={handleChangeInput}
                  >
                    <option value="">Choose Category...</option>
                    {categories?.map((item) => {
                      return (
                        <option value={item.name} key={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <div>
                    <Button
                      className="create__product--btn"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      {onEdit ? 'Update Product' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </div>
            </Paper>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Paper className="paper__container">
          <React.Fragment>
            <h2>Products List</h2>
            <Table style={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell className="order__item">Name</TableCell>
                  <TableCell className="order__item">Image</TableCell>
                  <TableCell className="order__item">Price</TableCell>
                  <TableCell className="order__item">Sold</TableCell>
                  <TableCell className="order__item">Category</TableCell>
                  <TableCell className="order__item" align="right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="order__item">{item.title}</TableCell>
                    <TableCell className="order__item">
                      <img
                        src={item.images.url ? item.images.url : ''}
                        alt={item.title}
                        className="order__image"
                      />
                    </TableCell>
                    <TableCell className="order__item">{item.price}$</TableCell>
                    <TableCell className="order__item">{item.sold}</TableCell>
                    <TableCell className="order__item">
                      {item.category}
                    </TableCell>
                    <TableCell className="order__item" align="right">
                      <Link to={`/admin/${item._id}`}>
                        <Button
                          className="admin__btn"
                          variant="contained"
                          color="primary"
                        >
                          Edit
                        </Button>
                      </Link>
                      &nbsp;
                      <Button
                        className="admin__btn"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          deleteProduct(item._id, item.images.public_id)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        </Paper>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            height: 100,
            justifyContent: 'space-around',
          }}
        >
          <div>
            <h4>Quantity Products</h4>
            <p>{products?.length}</p>
          </div>
          <div>
            <h4>Quantity Sold</h4>
            <p>{products?.reduce((prev, item) => prev + item.sold, 0)}</p>
          </div>
        </Paper>
      </Grid>
    </>
  );
}