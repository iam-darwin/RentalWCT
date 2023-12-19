import express from "express"
import cors from 'cors';


import { utils } from "./utils/index"
import apiRoutes from "./routes/index"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api",apiRoutes)

app.listen(utils.PORT, () => {
    console.log(`Server started at ${utils.PORT}`);
})