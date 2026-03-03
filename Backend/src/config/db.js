import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MonogoDb Connected Successfully: ${connect.connection.host}`);
  } catch (error) {
    console.log("Errror in connecting to database:", error.message);
    process.exit(1);
  }
};
