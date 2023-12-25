import express from "express"
import cors from 'cors';


import { utils } from "./utils/utilities"
import apiRoutes from "./routes/index"
import { errorHandler } from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api",apiRoutes)

app.use(errorHandler)

app.listen(utils.PORT, () => {
    console.log(`Server started at ${utils.PORT}`);
})