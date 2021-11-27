const express = require("express");

const videosRouter = require("./videos");
const categoriesRouter = require("./categories");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("App online!");
});

router.use("/videos", videosRouter);
router.use("/categories", categoriesRouter);

module.exports = router;
