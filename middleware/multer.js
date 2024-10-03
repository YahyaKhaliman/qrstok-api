const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const imageName = req.body.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const extension = path.extname(file.originalname);
    cb(null, `${imageName}${extension}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
