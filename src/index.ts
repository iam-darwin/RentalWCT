import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

import { utils } from "./utils/utilities";
import apiRoutes from "./routes/index";
import { errorHandler } from "./middlewares";

const app = express();

const specificFilePath = "/home/user/RentalWCT/public/index.html";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api", apiRoutes);
app.use("/*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(specificFilePath));
});
app.use(errorHandler);

app.listen(utils.PORT, () => {
  console.log(`Server started at ${utils.PORT}`);
});
