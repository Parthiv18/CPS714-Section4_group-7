// server.js (place at project root, run with: node server.js)
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // allow React dev server
  })
);
app.use(express.json());


const serviceAccount = {
  "info goes here"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/api/collections", async (req, res) => {
  try {
    const collections = await db.listCollections();
    const result = [];

    for (const col of collections) {
      const snap = await col.get();
      const docs = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
      result.push({ name: col.id, documents: docs });
    }

    res.json(result);
  } catch (err) {
    console.error("Firestore error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);
