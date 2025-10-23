const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); // Middleware to parse JSON

const port = 3000;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Use the lowercase name here
    const database = client.db("assetsmanager"); 
    const assetsCollection = database.collection("assets");

    // === API ENDPOINTS ===

    // GET all assets
    app.get('/assets', async (req, res) => {
      try {
        const assets = await assetsCollection.find({}).toArray();
        res.json(assets);
      } catch (err) {
        res.status(500).send("Error fetching assets");
      }
    });

    // POST a new asset
    app.post('/assets', async (req, res) => {
      try {
        const newAsset = req.body;
        const result = await assetsCollection.insertOne(newAsset);
        res.status(201).json(result); // 201 means "Created"
      } catch (err) {
        res.status(500).send("Error creating asset");
      }
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

run();