const express = require('express');
const { adminAnalytics, facultyAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/admin', protect, allowRoles('super_admin'), adminAnalytics);
router.get('/faculty', protect, allowRoles('faculty'), facultyAnalytics);

module.exports = router;
