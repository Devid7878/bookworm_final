import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GlobalState } from '../../globalState/GlobalState';
import { useContext } from 'react';

import './Admin.css';

export default function Orders() {
  const state = useContext(GlobalState);
  const history = state?.userAPI.history;
  const setHistory = state?.userAPI.setHistory;

  const [status, setStatus] = React.useState<any>('pending');

  // const handleChange = (e: SelectChangeEvent<HTMLSelectElement>) => {
  //   console.log(e.target.value);
  //   setStatus(e.target.value);
  //   console.log(history);
  //   setHistory && setHistory()
  // };

  return (
    <React.Fragment>
      {/* <Title>Recent Orders</Title> */}
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell className="order__item">Date</TableCell>
            <TableCell className="order__item">Name</TableCell>
            {/* <TableCell className="order__item">PaymentID</TableCell> */}
            <TableCell className="order__item">Quantity</TableCell>
            <TableCell className="order__item" align="right">
              Sale Amount
            </TableCell>
            <TableCell className="order__item" align="right">
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history?.map(
            (item: {
              _id: string;
              updatedAt: string;
              name: string;
              paymentID: string;
              cart: [];
              status: string;
            }) => (
              <TableRow key={item._id}>
                <TableCell className="order__item">{item.updatedAt}</TableCell>
                <TableCell className="order__item">{item.name}</TableCell>
                {/* <TableCell className="order__item">{item.paymentID}</TableCell> */}
                <TableCell className="order__item">
                  {item.cart.map(
                    (
                      cartItem: {
                        images: { url: string };
                        title: string;
                        quantity: number;
                      },
                      index
                    ) => {
                      return (
                        <div key={index} className="flexrow">
                          <img
                            src={cartItem.images.url}
                            alt=""
                            className="order__image"
                          />
                          <p>
                            {cartItem.title} - {cartItem.quantity}
                          </p>
                        </div>
                      );
                    }
                  )}
                </TableCell>
                <TableCell className="order__item" align="right">
                  $
                  {item.cart.reduce(
                    (
                      prev,
                      cartItem: {
                        quantity: number;
                        price: number;
                      }
                    ) => prev + cartItem.quantity * cartItem.price,
                    0
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e: SelectChangeEvent<HTMLSelectElement>) => {
                      console.log(e.target.value);
                      setStatus(e.target.value);
                      console.log(history);
                      item.status = e.target.value.toString();

                      const updatedHistory = history.map((item: {}) => {
                        return { ...item };
                      });

                      // setHistory && setHistory(updatedHistory);
                    }}
                  >
                    <MenuItem value="none">Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="outfordelivery">Out for delivery</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
