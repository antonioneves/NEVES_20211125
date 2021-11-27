const express = require("express");
const router = express.Router();

const { category } = require("../models");

router.get("/", async (req, res) => {
  res.json(await category.findAll());
});

module.exports = router;
