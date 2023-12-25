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

export function excludeFields<T>(obj: T, keys: (keyof T)[]): Partial<T> {
  return Object.fromEntries(
    //@ts-ignore
    Object.entries(obj).filter(([key]) => !keys.includes(key as keyof T))
  ) as Partial<T>;
}

export function calculateCost(amountString: string): string {
  const amount = parseFloat(amountString);
  if (!isNaN(amount)) {
    const result = (amount * 1.2).toFixed(2);
    return result;
  } else {
    return "Invalid input, please provide a valid number.";
  }
}