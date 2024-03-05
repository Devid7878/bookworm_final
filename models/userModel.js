const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A user must have a name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'A user must have a email'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'A user must have a password'],
		},
		avatar: {
			type: String,
			default: '',
		},
		mobile: {
			type: String,
			default: '',
		},
		address: {
			type: String,
			default: '',
		},
		role: {
			type: Number,
			default: 0,
		},
		cart: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('User', userSchema);
