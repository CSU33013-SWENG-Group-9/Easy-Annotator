import multer from "multer";

export const config = {
  api: {
    bodyParser: false
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "video.mp4");
  }
});

var upload = multer({ storage: storage });

export default async (req, res) => {
  upload.single("video")(req, {}, err => {
    console.log(req.file); // do something with the file
    res.end(req.file.path);
  });
};
