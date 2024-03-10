const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		console.log(req.body);

		const user = await Users.findOne({ email });
		if (user) return res.status(400).json({ msg: 'Email already exists.' });

		if (password.length < 6)
			return res
				.status(400)
				.json({ msg: 'Password must be at least 6 characters long.' });

		// Password encryption
		// const passwordHash = await bcrypt.hash(password, 10);

		const newUser = await Users.create({
			name,
			email,
			password,
			role,
		});

		// Save mongodb
		await newUser.save();

		// Create jsonwebtoken to authentication
		const accesstoken = createAccessToken({ id: newUser._id });
		const refreshtoken = createRefreshToken({ id: newUser._id });

		res.cookie('refreshtoken', refreshtoken, {
			httpOnly: true,
			// path: '/user/refresh_token',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		req.user = user;

		res.json({ accesstoken });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await Users.findOne({ email });
		if (!user) return res.status(404).json({ msg: 'User does not exist.' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' });

		// If login success, create accesstoken and refreshtoken
		const accesstoken = createAccessToken({ id: user._id });
		const refreshtoken = createRefreshToken({ id: user._id });

		// Set the refreshtoken to cookie in browser headers
		res.cookie('refreshtoken', refreshtoken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			accesstoken,
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.logout = async (req, res) => {
	try {
		res.clearCookie(
			'refreshtoken',
			// { path: '/user/refresh_token' }
		);

		return res.json({ msg: 'Logged out.' });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.refreshToken = (req, res) => {
	try {
		const rf_token = req.cookies.refreshtoken;
		if (!rf_token)
			return res.status(401).json({ msg: 'Please Login or Register.' });

		jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err)
				// return res.status(400).json({ msg: 'Please Login or Register.' });
				return res.status(400).json({ msg: err });

			const accesstoken = createAccessToken({ id: user.id });
			res.json({ user, accesstoken });
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await Users.find().select('-password');

		res.json(users);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = await Users.findById(req.user.id).select('-password');
		if (!user) return res.status(400).json({ msg: 'User does not exist.' });

		res.json(user);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		if (!req.params.id) return res.status(403).json({ msg: 'No user found!' });
		await Users.findByIdAndDelete(req.params.id).select('-password');
		res.status(204).json({ data: null });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.addToCart = async (req, res) => {
	try {
		const user = await Users.findById(req.user.id);
		if (!user) return res.status(404).json({ msg: 'User does not exist.' });

		const updatedUser = await Users.findOneAndUpdate(
			{ _id: req.user.id },
			{
				cart: req.body.cart,
			},
		);
		return res.json({
			status: 'success',
			data: {
				user: updatedUser,
			},
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.history = async (req, res) => {
	try {
		const history = await Payments.find({ user_id: req.user.id });
		res.json(history);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.updateHistory = async (req, res) => {
	try {
		const history = await Payments.findByIdAndUpdate(
			req.user.id,
			{ status: req.body.status },
			{ new: true },
		);
		console.log(history);
		res.status(200).json({ history });
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

exports.emptyCart = async (req, res) => {
	try {
		if (!req.user.id) return res.status(401).json({ msg: 'Login / Register' });
		await Users.findByIdAndUpdate(req.user.id, { cart: [] }, { new: true });
		res.status(200).json({ msg: 'Cart successfully updated' });
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};


const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
