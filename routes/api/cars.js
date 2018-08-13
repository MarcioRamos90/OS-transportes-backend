const express = require("express");

const router = express.Router();

// @route GET api/users/test
// @desc Test cars routers
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "CARS funcionando" });
});

module.exports = router;
