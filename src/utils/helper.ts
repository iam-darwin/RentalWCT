import multer from "multer";
import path from "path";

export const upload = multer({
  dest: path.join(__dirname, "uploads/"),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["csv"];

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    if (allowedFileTypes.includes(fileExtension)) {
      return cb(null, true);
    } else {
      //@ts-ignore
      return cb(new Error("CSV_file"), false);
    }
  },
});

export function hasAtLeastTenDigits(input:string) {
  const digitRegex = /\d/g;
  const digitCount = (input.match(digitRegex) || []).length;
  return digitCount < 10;
}