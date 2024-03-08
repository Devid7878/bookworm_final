import React, { useContext, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GlobalState } from '../../globalState/GlobalState';
import { Button } from '@mui/material';
import axios from 'axios';
import Loading from '../Support/Loading';

function Admin() {
  const state = useContext(GlobalState);
  //   const products = state?.productsAPI.products;
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

  const updatedProd = products?.map((product) =>
    !product.checked ? product : null
  );
  {
    isLoading && <Loading />;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: '500px' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ maxWidth: '500px' }}>
              Title
            </TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Authors</TableCell>
            <TableCell align="center">Approve/Reject</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {updatedProd?.map((product) => (
            <TableRow key={product?.title}>
              <TableCell
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  maxWidth: '500px',
                }}
              >
                <img
                  src={product?.images.url}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    padding: '0 20px',
                  }}
                />
                {product?.title}
              </TableCell>
              <TableCell align="center">${product?.price}</TableCell>
              <TableCell align="center">{product?.category}</TableCell>
              <TableCell align="center">{product?.authors}</TableCell>
              <TableCell align="center" sx={{ display: 'flex' }}>
                <Button color="success">Approve</Button>
                <Button color="error">Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default Admin;
