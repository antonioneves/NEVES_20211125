const express = require("express");
const router = express.Router();
const path = require("path");
const genThumbnail = require("simple-thumbnail");
const { Writable } = require("stream");

const allowedExtension = [".mov", ".mp4"];

// writable stream
let thumbnail64 = [];
let thumbnail128 = [];
let thumbnail256 = [];

let thumbnail64Writable = new Writable({
  write: (chunk, encoding, next) => {
    thumbnail64.push(chunk);
    next();
  },
});
let thumbnail128Writable = new Writable({
  write: (chunk, encoding, next) => {
    thumbnail128.push(chunk);
    next();
  },
});
let thumbnail256Writable = new Writable({
  write: (chunk, encoding, next) => {
    thumbnail256.push(chunk);
    next();
  },
});

const { video, category } = require("../models");

router.get("/", async (req, res) => {
  res.json(
    await video.findAll({
      include: [
        {
          model: category,
          as: "category",
        },
      ],
    })
  );
});

router.post("/", async (req, res) => {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  const file = req.files.file;
  const fileInfo = JSON.parse(req.body.fileInfo);
  const extension = path.extname(file.name).toLowerCase();

  if (!allowedExtension.includes(extension))
    return res.status(422).send("Invalid File");

  const videoPath = `./public/videos/${Date.now()}_${file.name}`;

  file.mv(videoPath, (err) => {
    if (err) return res.status(500).send(err);
  });

  try {
    // Create thumbnails
    await genThumbnail(videoPath, thumbnail64Writable, "64x64");
    await genThumbnail(videoPath, thumbnail128Writable, "128x128");
    await genThumbnail(videoPath, thumbnail256Writable, "256x256");
  } catch (err) {
    return res.status(500).send(err);
  }

  // Add video to DB
  const categoryFound = await category.findByPk(fileInfo.categoryId);
  if (categoryFound) {
    const videoData = {
      title: fileInfo.title,
      thumbnail256: Buffer.concat(thumbnail256),
      thumbnail128: Buffer.concat(thumbnail128),
      thumbnail64: Buffer.concat(thumbnail64),
      path: videoPath,
      categoryId: fileInfo.categoryId,
    };
    video
      .create(videoData)
      .then((video) => {
        return res.status(200).json(video.dataValues);
      })
      .catch(res.status(500).send);
  } else {
    return res.status(404).send("Video category not found");
  }
});

module.exports = router;
