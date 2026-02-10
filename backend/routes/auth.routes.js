const express = require('express');
const { signup, login, createFacultyByAdmin, getProfile, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/faculty', protect, allowRoles('super_admin'), createFacultyByAdmin);
router.get('/me', protect, getProfile);
router.patch('/me', protect, updateProfile);

module.exports = router;
