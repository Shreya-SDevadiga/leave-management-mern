require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const make = async (name, email, password, role) => {
    if (!(await User.findOne({ email }))) {
      await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
      console.log('Created', email);
    }
  };
  await make('Admin', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, 'admin');
  await make('Asha Rao', 'asha@company.com', 'Emp@123', 'employee');
  process.exit(0);
})();
