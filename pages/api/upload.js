import formidable from "formidable";
import multer from "multer";
import ReactPlayer from "react-player";

export const config = {
  api: {
    bodyParser: false
  }
};

var file;

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log(files);
    res.end();
  });
};
