Pastebin-Lite

A lightweight Pastebin-like application built using Node.js, Express, and MongoDB.
Users can create text pastes and share a link to view them. Pastes can optionally expire based on time (TTL) or number of views.

This project is built as part of a take-home assignment and is designed to be API-driven, persistent, and serverless-safe.

✨ Features

Create a text paste

Receive a shareable URL

View paste via API or browser

Optional constraints:

Time-based expiry (TTL)

View-count limit

Deterministic time support for testing

Persistent storage (no in-memory data loss)

🛠️ Tech Stack

Node.js

Express.js

MongoDB (Mongoose)

NanoID for short paste IDs

Plain HTML + CSS for UI

📦 API Endpoints
Health Check
GET /api/healthz


Response:

{ "ok": true }

Create Paste
POST /api/pastes


Request body:

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "abc123xy",
  "url": "http://localhost:3000/p/abc123xy"
}

Fetch Paste (API)
GET /api/pastes/:id


Response:

{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}

View Paste (HTML)
GET /p/:id


Returns an HTML page rendering the paste safely.

🧪 Deterministic Time (Testing Support)

If the environment variable below is set:

TEST_MODE=1


The request header:

x-test-now-ms: <milliseconds since epoch>


will be treated as the current time for expiry logic.

💾 Persistence Layer

This project uses MongoDB (via Mongoose) as its persistence layer.

Why MongoDB?

Data survives across requests

Works reliably on serverless platforms

Supports TTL and counters cleanly

Free tier available via MongoDB Atlas

🚀 Running Locally
1️⃣ Clone the repository
git clone <your-repo-url>
cd pastebin-lite

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
MONGO_URI=your_mongodb_connection_string
TEST_MODE=0

4️⃣ Start the server
node src/server.js

5️⃣ Open in browser
http://localhost:3000

⚠️ Notes & Design Decisions

Custom string IDs are used instead of MongoDB ObjectIds for shorter URLs.

Server-side rendering is intentionally minimal; UI is not heavily styled.

No secrets or credentials are committed.

No in-memory storage is used (safe for serverless environments).

Paste content is rendered safely (no script execution).

📌 Deployment

This project can be deployed to:

Vercel

Render

Railway

MongoDB Atlas is recommended for production persistence.

✅ Assignment Compliance

✔ All required API routes implemented

✔ JSON responses with correct status codes

✔ Persistent storage

✔ Deterministic expiry support

✔ No hardcoded localhost URLs

✔ No global mutable state

👤 Author

Built by Praveen Kumar