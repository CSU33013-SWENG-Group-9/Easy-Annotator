import multer from "multer";

export const config = {
  api: {
    bodyParser: false
  }
};

const upload = multer({ dest: "uploads/" });

export default async (req, res) => {
  upload.single("video")(req, {}, err => {
    console.log(req.file); // do something with the file
    res.end(req.file.path);
  });
};
