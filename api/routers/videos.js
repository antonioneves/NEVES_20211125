const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Videos list");
});

router.post("/", (req, res) => {
  res.send("New video added");
});

module.exports = router;
