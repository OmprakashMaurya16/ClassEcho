import express from "express";
import { createUser } from "../controllers/user.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, authorizeRoles("ADMIN"), createUser);

export default router;
