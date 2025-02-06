const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as needed
const Seeker = require('../models/seeker'); // Adjust path if necessary
const Founder = require('../models/finder'); // Adjust path if necessary
require('dotenv').config();

// Database Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testDB'; // Replace with your MongoDB URI
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register User
exports.register = async (req, res) => {
  try {
    const { names, email, phone, homelocation, password } = req.body;

    // Check if user already exists (by email or phone)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      names,
      email,
      phone,
      homelocation,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set session variables
    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

// Select a role for the user
exports.selectRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.session.userId;

  try {
    if (!userId) return res.status(401).json({ message: 'You must be logged in to select a role.' });

    if (role === 'Founder') {
      // Check if the user already exists as a Founder
      const existingFounder = await Founder.findOne({ userId });
      if (!existingFounder) {
        const newFounder = new Founder({ userId });
        await newFounder.save();
      }
      req.session.role = 'Founder';
      res.json({ message: 'Role set to Founder. You will be redirected to your Founder dashboard.' });
    } else if (role === 'Seeker') {
      // Check if the user already exists as a Seeker
      const existingSeeker = await Seeker.findOne({ userId });
      if (!existingSeeker) {
        const newSeeker = new Seeker({ userId });
        await newSeeker.save();
      }
      req.session.role = 'Seeker';
      res.json({ message: 'Role set to Seeker. You will be redirected to your Seeker dashboard.' });
    } else {
      res.status(400).json({ message: 'Invalid role selected' });
    }
  } catch (error) {
    console.error('Error selecting role:', error);
    res.status(500).json({ message: 'Error selecting role', error: error.message });
  }
};

// Middleware to check if the user is logged in and has selected a role
exports.isRoleSelected = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ message: 'You must be logged in to select a role.' });
  }
  if (!req.session.role) {
    return res.status(400).json({ message: 'Please select a role first.' });
  }
  next();
};

// Redirect user to appropriate dashboard based on the role
exports.redirectToDashboard = (req, res) => {
  if (req.session.role === 'seeker') {
    return res.json({ message: 'Redirecting to Seeker Dashboard', role: req.session.role });
  } else if (req.session.role === 'founder') {
    return res.json({ message: 'Redirecting to Founder Dashboard', role: req.session.role });
  } else {
    return res.status(400).json({ message: 'No role selected' });
  }
};

// Middleware to check if user is logged in
exports.isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ message: 'You must be logged in to access this route' });
  }
  next();
};

// Example of a protected route
exports.protectedRoute = (req, res) => {
  res.json({ message: 'This is a protected route' });
};
