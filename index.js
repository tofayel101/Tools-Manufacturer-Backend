const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Tools_manufacturer:lVlN0B50YQNcM0Kt@cluster0.0c3su.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const toolsCollection = client.db("tools-manufacturer").collection("tools");
    const usersCollection = client.db("tools-manufacturer").collection("users");
    const ordersCollection = client.db("tools-manufacturer").collection("orders");

    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result =await toolsCollection.findOne(query);    
      res.send(result);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const results = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign({ email: email }, '3abb0eb5b8e2b95caa9543183b8f15f855a21d4d0a54e465b62cbcfa2b08bbb3ca855c7f39981b65ec7a953740d891be9248c5958de59315444ff4e6c8ab3472',{expiresIn:'1h'});
      res.send({results,token});
    });


    app.post('/order', async (req,res)=>{
      const order=req.body
      const results=await ordersCollection.insertOne(order)
      res.send(results)
    })


    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);

    })
  }
   finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tools Manufacturer");
});
app.listen(port, () => {
  console.log("server is running");
});
