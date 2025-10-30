const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// === MIDDLEWARE SETUP ===
app.use(cors());
app.use(express.json());

// Serve the 'uploads' folder so images can be displayed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// **THIS IS THE CRUCIAL LINE TO SERVE YOUR HTML/CSS/JS FILES**
// It must come before the API endpoints.
app.use(express.static(path.join(__dirname, '')));


// === MULTER CONFIG ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// === DATABASE AND SERVER STARTUP ===
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
      const assets = await assetsCollection.find({}).toArray();
      res.json(assets);
    });

    app.post('/assets', upload.single('image'), async (req, res) => {
      try {
        const textData = req.body;
        const imageFile = req.file;

        const newAsset = {
          ...textData,
          value: parseFloat(textData.value || 0),
          monthlyIncome: parseFloat(textData.monthlyIncome || 0),
          taxRate: parseFloat(textData.taxRate || 0),
          depreciationRate: parseFloat(textData.depreciationRate || 0),
          imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null
        };
        
        const result = await assetsCollection.insertOne(newAsset);
        res.status(201).json(result);
      } catch (err) {
        console.error("Error creating asset:", err);
        res.status(500).send("Error creating asset");
      }
    });

    app.delete('/assets/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await assetsCollection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Asset deleted successfully" });
        } else {
          res.status(404).send("Asset not found");
        }
      } catch (err) {
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