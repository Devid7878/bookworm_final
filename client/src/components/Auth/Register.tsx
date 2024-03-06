import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../../globalState/GlobalState';

const theme = createTheme();

export default function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();
  const state = React.useContext(GlobalState);
  const setIsLogged = state?.userAPI.setIsLogged;

  const registerSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post(
        '/user/register',
        { ...user },
        { withCredentials: true }
      );
      localStorage.setItem('Login', 'true');
      setIsLogged && setIsLogged(true);
      navigate('/');
    } catch (err: any) {
      Swal.fire(err.response.data.msg);
    }
  };
  return (
    <div className="main">
      <ThemeProvider theme={theme}>
        <Container component="main">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography component="h1" variant="h3">
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={registerSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={user.name}
                onChange={onChangeInput}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="email"
                name="email"
                autoComplete="email"
                value={user.email}
                onChange={onChangeInput}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={user.password}
                onChange={onChangeInput}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ fontSize: '1.8rem' }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
