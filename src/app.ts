import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import index from "./routes/index";

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://seu-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(new Error("Not allowed by CORS"));
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use("/api", index);
app.get("/api", (_, res) => {
  res.json({ message: "API funcionando!" });
});

export default app;
