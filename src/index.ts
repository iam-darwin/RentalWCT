import express from "express"
import cors from 'cors';
import path from 'path';


import { utils } from "./utils/utilities"
import apiRoutes from "./routes/index"
import { errorHandler } from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/api",apiRoutes)

app.use(errorHandler)

app.listen(utils.PORT, () => {
    console.log(`Server started at ${utils.PORT}`);
})