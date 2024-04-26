const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ylecqg.mongodb.net/?retryWrites=true&w=majority`;
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

    //database collection
    const collegeCollection = client
      .db("college-feature")
      .collection("colleges");
    const researchCollection = client
      .db("college-feature")
      .collection("researches");
    const reviewCollection = client.db("college-feature").collection("reviews");
    const usersCollection = client.db("college-feature").collection("users");

    //get colleges
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // post a users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const exist = await usersCollection.findOne(query);

      if (exist) {
        return res.send({ message: "user already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //update a user
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const userDetails = req.body;

      console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUserDetails = {
        $set: {
          ...userDetails,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updatedUserDetails,
        options
      );
      res.send(result);
    });

    //get researches
    app.get("/researches", async (req, res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    });

    //get colleges
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    //get reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(" You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//test
app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
