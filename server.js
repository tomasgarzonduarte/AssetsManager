const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Make sure this line is here

const app = express();

// Set up middleware
app.use(cors()); // This line MUST come before your endpoints
app.use(express.json());

const port = 3000;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const database = client.db("assetsManager"); 
    const assetsCollection = database.collection("assets");

    // === API ENDPOINTS ===

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
    console.log('POST /assets endpoint was hit!');

      try {
        const newAsset = req.body;
        const result = await assetsCollection.insertOne(newAsset);
        res.status(201).json(result);
      } catch (err) {
        console.error("Server error:", err); // I've added a label here for clarity
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