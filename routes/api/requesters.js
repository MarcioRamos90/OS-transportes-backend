const express = require("express");

const router = express.Router();

// @route GET api/users/test
// @desc Test requesters routers
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "REquesters funcionando" });
});

module.exports = router;
