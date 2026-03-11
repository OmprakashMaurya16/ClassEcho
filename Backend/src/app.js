import express from "express";
import cors from "cors";
import sendResponse from "./utils/response.helper.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

import userRoutes from "./routes/user.routes.js";

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "ClassEcho Backend",
  });
});

app.use((err, req, res, next) => {
  if (err.name === "ApiError") {
    return sendResponse(res, err.statusCode, err.message);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendResponse(res, 400, messages.join(", "));
  }

  console.error("UNHANDLED ERROR:", err.name, err.message, err.stack);
  return sendResponse(res, 500, err.message);

  return sendResponse(res, 500, "Internal server error");
});

export default app;
