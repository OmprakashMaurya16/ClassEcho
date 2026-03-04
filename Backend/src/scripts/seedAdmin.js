import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const email = "admin@vit.edu.in";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin with email "${email}" already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const admin = new User({
    fullName: "Super Admin",
    email,
    password: "Admin$Vit",
    role: "ADMIN",
  });

  await admin.save();
  console.log(`Admin created successfully:`);
  console.log(`  Email   : ${email}`);
  console.log(`  Password: Admin$Vit`);
  console.log(`  Role    : ADMIN`);

  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
