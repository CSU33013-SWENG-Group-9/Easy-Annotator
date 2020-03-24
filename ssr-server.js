const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const TokenGenerator = require("uuid-token-generator");

const creationMap = []

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "videos");
  },
  filename: function(req, file, cb) {
    console.log(file);
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
    const server = express();
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)
    
    server.use(express.static("public"))

    server.get("/fetchVideo", (req, res) => {
      const path = creationMap[req.query.creationToken];
      res.sendFile(__dirname + "/" + path)
    });

    server.get("/deleteVideo", (req, res) => {
      console.log("Deleting file")
      const path = creationMap[req.query.creationToken];
      fs.unlinkSync(path)
      res.sendStatus(200)
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.post("/upload", (req, res) => {
      upload.single("video")(req, {}, _ => {
        token = tokgen.generate();
        creationMap[token] = req.file.path
        res.send(token);
      });
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:" + (process.env.REACT_APP_PORT || 3000));
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
