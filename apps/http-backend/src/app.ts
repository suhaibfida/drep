import express from "express";
import router from "./router/pageRouter";
import connect from "./config/db.js";
const app = express();
app.use(express.json);
connect();
app.use("api/v1/", router);
app.listen(3000);
