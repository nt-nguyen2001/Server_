import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./src/Uploads/${req.body.userId}/${req.body.id}`;
    if (!existsSync(path)) {
      try {
        mkdirSync(`./src/Uploads/${req.body.userId}/${req.body.id}`, {
          recursive: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  console.log("FILE MIMETYPE", file.mimetype);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //reject file
    cb(new Error("Unsupported file format"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export { upload };
