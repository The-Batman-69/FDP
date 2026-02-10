const User = require('../models/User');
const { signToken } = require('../config/auth');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  designation: user.designation
});

const signup = async (req, res) => {
  try {
    const { name, email, password, role, department, designation } = req.body;
    if (role && role !== 'participant') {
      return res.status(403).json({ message: 'Self-signup supports participant role only.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: 'participant',
      department,
      designation
    });

    const token = signToken({ id: user._id, role: user.role });
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id, role: user.role });
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createFacultyByAdmin = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, department, designation, role: 'faculty' });
    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => res.json({ user: req.user });

const updateProfile = async (req, res) => {
  try {
    const updates = (({ name, department, designation }) => ({ name, department, designation }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, createFacultyByAdmin, getProfile, updateProfile };
