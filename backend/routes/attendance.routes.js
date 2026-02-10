const express = require('express');
const { markAttendance, getAttendance, exportAttendance } = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/', protect, allowRoles('faculty', 'super_admin'), markAttendance);
router.get('/:fdpId', protect, allowRoles('faculty', 'super_admin'), getAttendance);
router.get('/:fdpId/export/excel', protect, allowRoles('faculty', 'super_admin'), exportAttendance);

module.exports = router;
