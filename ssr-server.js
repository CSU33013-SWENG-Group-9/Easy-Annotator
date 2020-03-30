const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const TokenGenerator = require("uuid-token-generator");

const creationMap = [];

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "videos");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.originalname.slice(0, file.originalname.length - 4) +
        "" +
        Date.now() +
        "" +
        path.extname(file.originalname)
    );
  }
});

var upload = multer({ storage: storage });

app
  .prepare()
  .then(() => {

    //Clear all files before program start
    fs.readdir("videos", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join("videos", file), err => {
          if (err) throw err;
        });
      }
    });

    const server = express();
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

    server.use(express.static("public"));

    server.get("/fetchVideo", (req, res) => {
      const path = creationMap[req.query.creationToken];
      res.sendFile(__dirname + "/" + path);
    });

    server.get("/frameRate", (req, res) => {
      const path = creationMap[req.query.creationToken];
      ffprobe(__dirname + "/" + path, { path: ffprobeStatic.path }, function(err, info) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }

        console.log(parseInt(info.streams[0].avg_frame_rate.split("/")[0])/parseInt(info.streams[0].avg_frame_rate.split("/")[1]));
        res.status(200).json({"fps": parseInt(info.streams[0].avg_frame_rate.split("/")[0])/parseInt(info.streams[0].avg_frame_rate.split("/")[1])});
      });
    });

    server.get("/deleteVideo", (req, res) => {
      console.log("Deleting file");
      const path = creationMap[req.query.creationToken];
      fs.unlinkSync(path);
      res.sendStatus(200);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.post("/upload", (req, res) => {
      upload.single("video")(req, {}, _ => {
        token = tokgen.generate();
        creationMap[token] = req.file.path;
        res.send({token: token, videoTitle: req.file.originalname.replace(".mp4", "")});
      });
    });

    server.listen(process.env.REACT_APP_PORT || 3000, err => {
      if (err) throw err;
      console.log(
        "> Ready on http://localhost:" + (process.env.REACT_APP_PORT || 3000)
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
