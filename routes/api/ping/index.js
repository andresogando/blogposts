const express = require("express");
const router = express.Router();

/* GET: api/ping */
router.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
