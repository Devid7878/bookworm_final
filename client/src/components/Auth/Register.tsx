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
import { Checkbox } from '@mui/material';

const theme = createTheme();

export default function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 0,
    passwordConfirm: '',
  });
  const [isChecked, setIsChecked] = useState(false);

  console.log(user);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();
  const state = React.useContext(GlobalState);
  const setToken = state?.setToken;

  const registerSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const token = await axios.post(
				'/user/register',
				{ ...user },
				{ withCredentials: true },
			);
			localStorage.setItem('Login', 'true');
			token && localStorage.setItem('token', token.data.accesstoken);
			token && setToken && setToken(token.data.accesstoken);
			token && navigate('/');
		} catch (err: any) {
			Swal.fire(err.response.data.msg);
		}
	};
	return (
		<div className='main'>
			<Container
				component='main'
				sx={{ display: 'flex', justifyContent: 'center' }}>
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						maxWidth: '50%',
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						{/* <LockOutlinedIcon /> */}
					</Avatar>
					<Typography component='h5' variant='h5'>
						Register
					</Typography>
					<Box component='form' onSubmit={registerSubmit} sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='name'
							label='Name'
							name='name'
							autoComplete='name'
							autoFocus
							value={user.name}
							onChange={onChangeInput}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='Email Address'
							value={user.email}
							onChange={onChangeInput}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							value={user.password}
							onChange={onChangeInput}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='passwordConfirm'
							label='Confirm Password'
							type='password'
							id='passwordConfirm'
							autoComplete='current-password'
							value={user.passwordConfirm}
							onChange={onChangeInput}
						/>
						<Checkbox
							value={user.role}
							checked={isChecked}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setIsChecked((isChecked) => !isChecked);
								e.target.checked
									? setUser({ ...user, role: 1 })
									: setUser({ ...user, role: 0 });
							}}
						/>{' '}
						Want to become a Seller?
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
							style={{ fontSize: '1rem' }}>
							Register
						</Button>
					</Box>
				</Box>
			</Container>
		</div>
	);
}
