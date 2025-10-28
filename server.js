const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Ensure ObjectId is imported
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const database = client.db("assetsManager"); // Correct case
    const assetsCollection = database.collection("assets");

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
        res.status(201).json(result);
      } catch (err) {
        res.status(500).send("Error creating asset");
      }
    });

    // DELETE an asset by its ID
    app.delete('/assets/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }; // Use ObjectId
        
        const result = await assetsCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Asset deleted successfully" });
        } else {
          res.status(404).send("Asset not found");
        }
      } catch (err) {
        console.error("Error deleting asset:", err);
        res.status(500).send("Error deleting asset");
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