const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createFDP,
  listFDPs,
  listPublicFDPs,
  getFDPById,
  updateFDP,
  registerForFDP,
  listRegistrations,
  myRegistrations,
  reviewRegistration
} = require('../controllers/fdp.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});
const upload = multer({ storage });

router.get('/public/list', listPublicFDPs);
router.get('/', protect, listFDPs);
router.get('/my-registrations', protect, allowRoles('participant'), myRegistrations);
router.get('/:id', protect, getFDPById);
router.post(
  '/',
  protect,
  allowRoles('super_admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  createFDP
);
router.patch('/:id', protect, allowRoles('super_admin'), updateFDP);
router.post('/:id/register', protect, allowRoles('participant'), upload.array('documents', 5), registerForFDP);
router.get('/:id/registrations', protect, allowRoles('super_admin', 'faculty'), listRegistrations);
router.patch('/registrations/:registrationId', protect, allowRoles('super_admin'), reviewRegistration);

module.exports = router;
