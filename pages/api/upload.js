import multer from "multer";
import path from "path";

export const config = {
  api: {
    bodyParser: false
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "videos");
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname.slice(0, file.originalname.length-4) + "" + Date.now() + "" + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

export default async (req, res) => {
  upload.single("video")(req, {}, err => {
    res.send(req.file.path);
  });
};
