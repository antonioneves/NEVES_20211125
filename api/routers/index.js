const express = require("express");

const videosRouter = require("./videos");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("App online!");
});

router.use("/videos", videosRouter);

module.exports = router;
