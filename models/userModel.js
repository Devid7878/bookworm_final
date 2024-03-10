const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
		// passwordConfirm: {
		// 	type: String,
		// 	required: [true, 'Please confirm your password'],
		// },
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

// userSchema.pre('save', async function (next) {
// 	// Only run this function if password was actually modified
// 	if (!this.isModified('password')) return next();

// 	// Hash the password with cost of 12
// 	this.password = await bcrypt.hash(this.password, 12);

// 	// Delete passwordConfirm field
// 	this.passwordConfirm = undefined;
// 	next();
// });

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};


module.exports = mongoose.model('User', userSchema);
