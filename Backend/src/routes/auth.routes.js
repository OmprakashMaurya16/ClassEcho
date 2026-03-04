import express from "express";
import { login, refreshToken, getMe } from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.get("/me", authMiddleware, getMe);

export default router;
