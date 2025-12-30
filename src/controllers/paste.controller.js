import Paste from "../models/Paste.js";
import { nanoid } from "nanoid";
import { now } from "../utils/time.js";

/* CREATE PASTE */
export const createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const paste = await Paste.create({
    _id: nanoid(8),
    content,
    expiresAt,
    maxViews: max_views || null,
  });

  res.status(201).json({
    id: paste._id,
    url: `${req.protocol}://${req.get("host")}/p/${paste._id}`,
  });
};

/* FETCH PASTE (API) */
export const getPasteApi = async (req, res) => {
  const currentTime = now(req);

  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,

      // Not expired
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: currentTime } }
      ],

      // Views not exceeded
      $or: [
        { maxViews: null },
        { $expr: { $lt: ["$views", "$maxViews"] } }
      ]
    },
    {
      $inc: { views: 1 }
    },
    {
      new: true
    }
  );

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : paste.maxViews - paste.views,
    expires_at: paste.expiresAt,
  });
};


/* FETCH PASTE (HTML) */
export const getPasteHtml = async (req, res) => {
  const currentTime = now(req);

  const paste = await Paste.findOneAndUpdate(
    {
      _id: req.params.id,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: currentTime } }
      ],
      $or: [
        { maxViews: null },
        { $expr: { $lt: ["$views", "$maxViews"] } }
      ]
    },
    {
      $inc: { views: 1 }
    },
    { new: true }
  );

  if (!paste) {
    return res.status(404).send("Not Found");
  }

  res.send(`
    <html>
      <body>
        <pre>${paste.content.replace(/</g, "&lt;")}</pre>
      </body>
    </html>
  `);
};

