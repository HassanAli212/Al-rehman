// Run this to reset ANY user's password (customer or admin):
//   node seed/resetUserPassword.js <email> <newPassword>
//
// Example:
//   node seed/resetUserPassword.js hassan@example.com myNewPass123

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Usage: node seed/resetUserPassword.js <email> <newPassword>");
  process.exit(1);
}

const run = async () => {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.connection.close();
    process.exit(1);
  }

  user.password = newPassword; // pre-save hook in User.js will re-hash it automatically
  await user.save();

  console.log(`Password reset successfully for: ${user.email} (role: ${user.role})`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Reset failed:", err.message);
  process.exit(1);
});