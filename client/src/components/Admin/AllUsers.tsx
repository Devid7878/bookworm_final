import React, { useContext, useEffect, useState } from 'react';

import { GlobalState } from '../../globalState/GlobalState';
import axios from 'axios';
import Loading from '../Support/Loading';
import Header from '../Header/Header';

import './AllUsers.css';
import Swal from 'sweetalert2';

function Listings() {
  const state = useContext(GlobalState);
  //   const products = state?.productsAPI.products;
  const token = state?.token;

  const [users, setUsers] = useState<
    {
      _id: string;
      name: string;
      email: string;
      role: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProds() {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/user');
      setUsers(res.data);
      console.log(res.data);
      setIsLoading(false);
    }

    fetchProds();
  }, []);

  const deleteUser = async (user: {
    name: string;
    email: string;
    _id: string;
    role: number;
  }) => {
    const data = await Swal.fire('Are you sure you want to delete this user?');
    if (data.isConfirmed) {
      await axios.delete(`http://localhost:5000/user/${user._id}`, {
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      });
      const updatedList = users?.filter((p) => p._id !== user._id);
      setUsers(updatedList);
    }
  };

  return (
    <div>
      <div className="container">
        <Header />

        {isLoading ? (
          <Loading />
        ) : (
          <div className="all-user-container-main">
            <div className="table-user">
              <div className="name">Name</div>
              <div className="email">Email</div>
              <div className="role">Role</div>
              <div className="delete">Delete User</div>
            </div>
            {users?.map(
              (product, idx) =>
                product &&
                product.role !== 2 && (
                  <div key={idx} className="tbody-user">
                    <div className="name">
                      {/* <img src={product?.images.url} alt='' /> */}
                      <p>{product?.name}</p>
                    </div>
                    <div className="email">
                      <p>{product?.email}</p>
                    </div>
                    <div className="role">
                      <p>
                        {product?.role === 1
                          ? 'Seller'
                          : product?.role === 2
                          ? 'Admin'
                          : 'Buyer'}
                      </p>
                    </div>
                    <div className="delete">
                      <button
                        onClick={() => deleteUser(product)}
                        className="delete"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Listings;
