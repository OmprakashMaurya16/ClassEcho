const express = require("express");
const {
  generateSession,
  validateSession,
  closeSession,
} = require("../controllers/session.controller.js");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  authorizeRoles("Faculty"),
  generateSession,
);

router.get("/:token", validateSession);

router.patch(
  "/:sessionId/close",
  authMiddleware,
  authorizeRoles("Faculty"),
  closeSession,
);

module.exports = router;
