import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import index from "./routes/index";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", index);
app.get("/api", (_, res) => {
  res.json({ message: "API funcionando!" });
});

export default app;
