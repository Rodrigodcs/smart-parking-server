import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text())

app.use(router);

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});