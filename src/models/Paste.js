import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true, // 👈 index needed
  },
  maxViews: {
    type: Number,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

/* TTL index */
pasteSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("Paste", pasteSchema);
