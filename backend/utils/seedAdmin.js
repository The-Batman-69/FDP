require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@fdp.local';
    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({
        name: 'Super Admin',
        email,
        password: 'Admin@123',
        role: 'super_admin',
        department: 'IQAC',
        designation: 'Administrator'
      });
      console.log('Admin created:', email);
    } else {
      console.log('Admin already exists:', email);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
})();
