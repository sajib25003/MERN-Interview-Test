const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ruowzmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const drawingCollection = client.db("DraftrixDB").collection("drawings");

    app.post("/drawings", async (req, res) => {
      const drawing = req.body;
      const result = await drawingCollection.insertOne(drawing);
      res.send(result);
    });

    app.get("/drawings", async (req, res) => {
      const result = await drawingCollection.find().toArray();
      res.send(result);
    });

    app.get("/drawings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await drawingCollection.findOne(query);
      res.send(result);
    });

    app.delete("/drawings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await drawingCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/drawings/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      try {
        const result = await drawingCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Drawing updated successfully." });
        } else {
          res.status(404).json({ message: "Drawing not found." });
        }
      } catch (error) {
        console.error("Error updating drawing:", error);
        res.status(500).json({ message: "Failed to update drawing." });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Draftrix server");
});

app.listen(port, () => {
  console.log(`Draftrix server is running on port ${port}`);
});
