// Run this once to create (or update) the admin account:
//   node seed/seedAdmin.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const ADMIN_EMAIL = "admin212@gmail.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Al Rehman Admin";

const run = async () => {
  await connectDB();

  let admin = await User.findOne({ email: ADMIN_EMAIL });

  if (admin) {
    admin.password = ADMIN_PASSWORD; // pre-save hook will re-hash it
    admin.role = "admin";
    await admin.save();
    console.log(`Existing user updated to admin: ${ADMIN_EMAIL}`);
  } else {
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
