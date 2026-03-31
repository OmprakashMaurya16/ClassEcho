const express = require("express");
const { submitFeedback } = require("../controllers/feedback.controller.js");

const router = express.Router();

router.post("/submit", submitFeedback);

module.exports = router;
