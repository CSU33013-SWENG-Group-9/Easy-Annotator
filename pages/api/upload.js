import multer from "multer";

export const config = {
  api: {
    bodyParser: false
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, "video.mp4");
  }
});

var upload = multer({ storage: storage });

export default async (req, res) => {
  upload.single("video")(req, {}, err => {
    res.send(req.file.path);
    res.end();
    console.log(req.file); // do something with the file
  });
  //https://medium.com/the-couch/adding-a-contact-form-to-your-next-js-app-7a1b5f63f27
};
