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

// --- HARD-CODED SERVICE ACCOUNT (for local testing only) ---
// Paste your actual private_key string where indicated below.
// DO NOT commit this file with the real key to any repo.
const serviceAccount = {
  type: "service_account",
  project_id: "coe714-9f054",
  private_key_id: "221fb796cc9a7c6dbeef5e34da65f3cba936d599",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcGbitB2LS7u3e\np5ZMPhuUMsfG8x+54YM/kN52Knhe/2o5dca0laB0AnsoKINuH4ccxWKCrsT2U05L\nAjW1EfMVZgD/1XZYsEQBdJrmAJ16Y4LQFuBXFhCR8blpmAo4dAuFJ8KBk14BBAQC\nAvd5CJHw9k9TMw8GQE/175xnkPakOENcfdyjXaEaGX091vvIrcuR2Yh9bx6+sGfG\ncSX91ZLvCAGu+jSVP810YruHD5J3wX26q+tUPDHB4rjj0sVMjTXh/ZoAe5cJepaG\noL352Y5erWn5HL9sgFMqsHLH2T8ORib6z9SOj8TWdC4KLhiRv9DskQ+IocVj4qSh\nrBq9E68dAgMBAAECggEAK7hqiI/WhnSkC+YNSvpkOAxG9vp2StYWMBIPtLHtd9H6\nuvA5QK/dulBNlTBPq2LKMW05S5fOk50+gvSx/S5zUm143y620F1CFtRFZCEM+k/v\nvf+CQvHrnyzAPQp35lreNSOvLyKKxCcPRk71aCFV2tLp4cgdr6cInj3HpRwtcE3f\nnkPavQNPFS0K6ed4ZthA7LezIxD5rQGz5cwFTUhNb1LBYXh7gsatI1PqeUKo8cVi\nAk81O1VlS5vOAzGNufpwIdPY81ICMhM5izkv30JyNqGMvBkGe/+IToo0o2Wjazkx\nj9B6Oov74+UXEg1KPWvacenFy2q82pX7bpI04lqoQwKBgQDVJewHQIqvG1z6TpNi\nUcCSvulQMhb49i1pE7QoFWAsj6xpfh7AY06/4eATzQpgDP6lB6dIc5q9EewbszO6\nnHh7faRyZKEay4AekdDuB/HQhgoOJGp3fulVcLqcPN5cCI74jtbU5a8d3FcTQGrC\nmuxsV7aj+2TU5MkAffnT37od2wKBgQC7e7tqcatwkbg8S4J3nkoMRXtB3z3HIHKi\n/b7BNRvNg5waOjepyfc/IAjVN/NpdX0UsEujgSY4ZwGhWmJKbJOH1pRgNZ4BQh8n\nZoQ/UVFRrIquiHzULS/WJsQRBvoYKx6F3/lxwgVHAQSCjp+psM/IVQB4k0pdzMBI\nsJBYTeLEZwKBgQCuo/ik5IP8/12KFVF7EGLJmbTOqYvbBtGkM6m74e+/8yQf9184\n4OVIIMkZUDm9A0itbPzqRxY07fdXpteugb/R5tsTg1HhA3YBFhZqwYWnBfw9JCc7\nq3eBMvEjTFggbj6+d0Kcg2ic/ck2k+QleQxXpPKXn0Y5jQ8H4TAOIlR7WwKBgEEP\nvEdBMSR8fTn3XkxSkxHVHuQKK68ptH6ZnhQAcSiNrqNvZpe2beXrIQWVSBRl4EVI\ntMcF75SNMoSjEA8RxNTUA2Or16xKHPOYYPZ0Kss0HGBbHy6mi74+b7YU/L9cX1hI\nFJGEqj4svTrtcbz6jfDQhrxRKPKKNoRDOaRbSwGrAoGAZtp0CLyNNih1Gev3+AMA\n1+GXSoEVOAvYNtsaVT32XhQpq8mj6WGR9yQs06tuMELpXf6sOLbEXZXkbM0ry2BZ\nC+NjmwidZqG9DwmIEsd3LGvQmGdbEBM5iIvzdJd65XubIUwtWLFcMC8PsdKxcUpy\nryR5Y/wE8v5KQxMslTdV8iU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@coe714-9f054.iam.gserviceaccount.com",
  client_id: "102329116390909701910",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40coe714-9f054.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// API endpoint: return all collections + documents
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
