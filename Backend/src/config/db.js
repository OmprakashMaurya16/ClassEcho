import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`MongoDB Connected Successfully: ${connect.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
