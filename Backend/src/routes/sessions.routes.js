const express = require("express");
const {
  generateSession,
  validateSession,
  closeSession,
  deleteSession,
  getFacultySessions,
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

router.get(
  "/mine",
  authMiddleware,
  authorizeRoles("Faculty"),
  getFacultySessions,
);

router.get("/:token", validateSession);

router.patch(
  "/:sessionId/close",
  authMiddleware,
  authorizeRoles("Faculty"),
  closeSession,
);

router.delete(
  "/:sessionId",
  authMiddleware,
  authorizeRoles("Faculty"),
  deleteSession,
);

module.exports = router;
