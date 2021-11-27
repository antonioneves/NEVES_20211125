const fs = require("fs");
const express = require("express");
const router = express.Router();
const path = require("path");
const genThumbnail = require("simple-thumbnail");

const allowedExtension = [".mov", ".mp4"];
const thumbnailDir = "./public/thumbnails";

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

  if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, {recursive: true}, err => {});

  const date = Date.now();

  const videoPath = `./public/videos/${date}_${file.name}`;
  const thumbnail64Path = `${thumbnailDir}/64_${date}.png`;
  const thumbnail128Path = `${thumbnailDir}/128_${date}.png`;
  const thumbnail256Path = `${thumbnailDir}/256_${date}.png`;

  file.mv(videoPath, (err) => {
    if (err) return res.status(500).send(err);

    try {
      // Create thumbnails
      genThumbnail(videoPath, thumbnail64Path, "64x64")
        .then(() => console.log("done64!"))
        .catch((err) => console.error(err));
      genThumbnail(videoPath, thumbnail128Path, "128x128")
        .then(() => console.log("done128!"))
        .catch((err) => console.error(err));
      genThumbnail(videoPath, thumbnail256Path, "256x256")
        .then(() => console.log("done256!"))
        .catch((err) => console.error(err));
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  try {
    // Add video to DB
    const categoryFound = await category.findByPk(fileInfo.categoryId);
    if (categoryFound) {
      const videoData = {
        title: fileInfo.title,
        thumbnail256: thumbnail256Path,
        thumbnail128: thumbnail128Path,
        thumbnail64: thumbnail64Path,
        path: videoPath,
        categoryId: fileInfo.categoryId,
      };
      const videoAdded = await video.create(videoData);
      return res.status(200).json(videoAdded);
    } else {
      return res.status(404).send("Video category not found");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
