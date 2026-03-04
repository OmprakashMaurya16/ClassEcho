import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI);

    console.log(`MonogoDb Connected Successfully: ${connect.connection.host}`);
  } catch (error) {
    console.log("Errror in connecting to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
