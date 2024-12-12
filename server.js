import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Environment-specific path for Firebase credentials
const serviceAccountPath =
  process.env.NODE_ENV === "production"
    ? "/secrets/authentication" // Production path (mounted volume in Cloud Run)
    : "../project-key.json"; // Local development path

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase credentials file not found at " + serviceAccountPath);
}

// Read the Firebase credentials JSON
const credentials = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inisialisasi Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("server is running");
});

// get all data
app.get("/homePage", async (req, res) => {
  try {
    const snapshot = await db.collection("jobs_data").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (e) {
    console.error("Error getting documents:", e);
    res.status(500).json({
      error: "Failed to fetch documents",
      details: e.message,
    });
  }
});

const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
