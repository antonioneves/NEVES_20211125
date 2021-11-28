const fs = require("fs");
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
  const videos = await video.findAll({
    raw: true,
    include: [
      {
        model: category,
        as: "category",
      },
    ],
  });
  res.json(videos);
});

router.get("/videoPlay", async (req, res) => {
  const range = req.headers.range;
  if (!range) return res.status(400).send("Requires Range header");

  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).send("Requires Video Id");

  const videoPath = (await video.findByPk(videoId))?.dataValues?.path;
  if (!videoPath) return res.status(400).send("Video not found");

  const options = {};

  let start;
  let end;

  const bytesPrefix = "bytes=";
  if (range.startsWith(bytesPrefix)) {
    const bytesRange = range.substring(bytesPrefix.length);
    const parts = bytesRange.split("-");
    if (parts.length === 2) {
      const rangeStart = parts[0] && parts[0].trim();
      if (rangeStart && rangeStart.length > 0) {
        options.start = start = parseInt(rangeStart);
      }
      const rangeEnd = parts[1] && parts[1].trim();
      if (rangeEnd && rangeEnd.length > 0) {
        options.end = end = parseInt(rangeEnd);
      }
    }
  }

  res.setHeader("content-type", "video/mp4");

  fs.stat(videoPath, (err, stat) => {
    if (err) {
      console.error(`File stat error for ${videoPath}.`);
      console.error(err);
      res.sendStatus(500);
      return;
    }

    let contentLength = stat.size;

    if (req.method === "HEAD") {
      res.statusCode = 200;
      res.setHeader("accept-ranges", "bytes");
      res.setHeader("content-length", contentLength);
      res.end();
    } else {
      let retrievedLength;
      if (start !== undefined && end !== undefined) {
        retrievedLength = end + 1 - start;
      } else if (start !== undefined) {
        retrievedLength = contentLength - start;
      } else if (end !== undefined) {
        retrievedLength = end + 1;
      } else {
        retrievedLength = contentLength;
      }

      res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

      res.setHeader("content-length", retrievedLength);

      if (range !== undefined) {
        res.setHeader(
          "content-range",
          `bytes ${start || 0}-${end || contentLength - 1}/${contentLength}`
        );
        res.setHeader("accept-ranges", "bytes");
      }

      const fileStream = fs.createReadStream(videoPath, options);
      fileStream.on("error", (error) => {
        console.log(`Error reading file ${videoPath}.`);
        console.log(error);
        res.sendStatus(500);
      });

      fileStream.pipe(res);
    }
  });
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
