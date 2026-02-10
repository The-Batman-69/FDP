const express = require('express');
const { generateCertificate, myCertificates, downloadCertificate } = require('../controllers/certificate.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/generate', protect, allowRoles('super_admin', 'faculty'), generateCertificate);
router.get('/mine', protect, allowRoles('participant'), myCertificates);
router.get('/:id/download', protect, downloadCertificate);

module.exports = router;
