import express from "express";
import path from "path";
import pasteRoutes from "./routes/paste.routes.js";

const app = express();

app.use(express.json());
app.use(express.static("src/public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/views/index.html"));
});

app.get("/api/healthz", (req, res) => {
  res.json({ ok: true });
});

app.use(pasteRoutes);

export default app;
