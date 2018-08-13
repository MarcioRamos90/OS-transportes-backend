const express = require("express");

const router = express.Router();

// @route GET api/users/test
// @desc Test drivers routers
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Drivers funcionando" });
});

module.exports = router;
