import app from "../src/app.js";
import mongoose from "mongoose";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }
  return app(req, res);
}
