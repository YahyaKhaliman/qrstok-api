const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../public/images");

    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        return cb(new Error("Unable to create directory"));
      }
      cb(null, dest);
    });
  },
  filename: (req, file, cb) => {
    const existingImageName = req.body.existingImageName;
    const extension = path.extname(file.originalname);

    const imageName = existingImageName
      ? existingImageName
      : req.body.name.replace(/[^a-zA-Z0-9_-]/g, "_") + extension;

    cb(null, imageName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          allowedTypes
      )
    );
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
