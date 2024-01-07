import multer from "multer";
import path from "path";
import { utils } from "./utilities";


export const upload = multer({
  dest: path.join(__dirname, "uploads/"),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["csv"];
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
      console.log(fileExtension)
    if (allowedFileTypes.includes(fileExtension)) {
      return cb(null, true);
    } else {
      //@ts-ignore
      return cb(new Error("CSV_file"), false);
    }
  },
});



export function hasAtLeastTenDigits(input: string) {
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

export function htmlTemplate(
  userName: string,
  token: string
): string {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #555555;
        }
        .cta-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Forgot Password?</h1>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <a href="${utils.adminURL}/${token}" class="cta-button">Reset Password</a>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${utils.adminURL}/${token}</p>
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        <p>Thanks,<br>Your Company Name</p>
    </div>
</body>
</html>`;

  return htmlTemplate;
}
