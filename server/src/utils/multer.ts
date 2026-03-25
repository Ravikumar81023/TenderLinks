import multer from "multer";
import path from "path";
import fs from "fs";

// Define a persistent storage path
// const UPLOADS_DIR = "/var/www/uploads/";
const UPLOADS_DIR = "uploads/";
// Ensure the directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
