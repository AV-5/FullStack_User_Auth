import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
  origin: process.env.CORS_origin,
  credentials: true
}));
app.use(express.json());
app.get("/api", (req, res) => {
    res.send("Hello from backend");
});

import healthcheckRoute from "./router/healthcheck_route.js";
import authRoute from "./router/auth_route.js";
app.use("/auth", authRoute);
app.use("/healthcheck", healthcheckRoute);

export default app;