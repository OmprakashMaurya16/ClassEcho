const path = require("path");
const fs = require("fs");

// Ensure `.env` is loaded even when this script is executed from `src/scripts`.
const envPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({
  quiet: true,
  ...(fs.existsSync(envPath) ? { path: envPath } : {}),
});

const connectDB = require("../config/db.js");
const User = require("../models/user.model.js");

const seed = async () => {
  await connectDB();

  const adminEmail = "admin.vidyalankar@vit.edu.in";
  const adminPassword = "Admin@Vit";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      fullName: "Vidyalankar Admin",
      email: adminEmail,
      password: adminPassword,
      role: "Admin",
    });
    console.log("Seeding completed successfully.");
    console.log("Admin created:", adminEmail);
  } else {
    existingAdmin.fullName = existingAdmin.fullName || "Vidyalankar Admin";
    existingAdmin.role = "Admin";
    existingAdmin.department = null;
    existingAdmin.designation = null;
    existingAdmin.password = adminPassword;
    await existingAdmin.save();

    console.log("Seeding completed successfully.");
    console.log("Admin updated (password reset):", adminEmail);
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
