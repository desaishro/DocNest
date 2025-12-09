const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// @desc    Register a new admin
// @route   POST /api/users/admin/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Register a new student
// @route   POST /api/users/student/register
// @access  Public
const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Register a new evaluator
// @route   POST /api/users/evaluator/register
// @access  Public
const registerEvaluator = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'evaluator',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Register a new faculty
// @route   POST /api/users/faculty
// @access  Private/Admin
const registerFaculty = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'faculty',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('[AUTH_LOGIN] body keys:', Object.keys(req.body || {}));
  console.log('[AUTH_LOGIN] email:', email);

  const user = await User.findOne({ email });

  console.log('[AUTH_LOGIN] userFound:', !!user, 'role:', user?.role);

  if (user && (await user.matchPassword(password))) {
    console.log('[AUTH_LOGIN] password match success for user:', user._id.toString());
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    console.log('[AUTH_LOGIN] invalid credentials for email:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get all faculty users
// @route   GET /api/users/faculty
// @access  Private/Admin
const getFaculty = asyncHandler(async (req, res) => {
  const faculty = await User.find({ role: 'faculty' }).select('-password');
  res.json(faculty);
});

module.exports = { registerAdmin, authUser, registerFaculty, getFaculty, registerStudent, registerEvaluator };
