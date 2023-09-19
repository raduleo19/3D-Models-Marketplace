const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;