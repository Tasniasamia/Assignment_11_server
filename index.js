const express = require('express')
const app = express()
const port = process.env.PORT || 9999;
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("toys");
    
    const collection= database.collection("toyscollection1");
    const toyscollection2= database.collection("toyscollection2");
    const toyscollection3= database.collection("toycollection3");

app.post('/AddToy',async(req,res)=>{
  const AddToy=req.body;
  const result = await toyscollection2.insertOne(AddToy);
  res.send(result);
})
app.post('/getmytoydata',async(req,res)=>{
const toydata=req.body;
const result=await toyscollection3.insertOne(toydata);

res.send(result);


})


app.delete('/mytoysdel/:id',async(req,res)=>{

  const id=req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await toyscollection3.deleteOne(query);
  console.log(result);
  res.send(result);

})

app.patch('/mytoyupdate/:id',async(req,res)=>{


  const id=req.params.id;
  const user=req.body;
  const filter = { _id:new ObjectId(id)};
  // const options = { upsert: true };


const updateDoc = {

$set: {

  ...user


},

};
const result = await toyscollection3.updateOne(filter, updateDoc);
console.log(result);
res.send(result);
})


    app.get('/subcategory',async(req,res)=>{
        const cursor =await collection.find().toArray();
        console.log(cursor);
        res.send(cursor);

    })
    app.get('/AllToys',async(req,res)=>{
      const cursor =await toyscollection2.find().toArray();
      res.send(cursor);
    })
    app.get('/AllToys/:id',async(req,res)=>{
const id=req.params.id;
      const ids = { _id: new ObjectId(id) };
      const movie = await toyscollection2.findOne(ids);
      res.send(movie);
    })
    app.get("/Alltoysdata/:text", async (req, res) => {
      const text = req.params.text;
      const result = await toyscollection2
        .find({
          $or: [
            { toyname: { $regex: text, $options: "i" } },
            { subcategory: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });
    app.get('/mytoys/:email',async(req,res)=>{
      console.log(req.params.email)
      const result=await toyscollection3.find({
        selleremail: req.params.email}).toArray();
      res.send(result);
    
    })
    
    app.get('/mytoysdata/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ _id: new ObjectId(id)};
      const finddata=await toyscollection3.findOne(query);
      console.log(finddata);
      res.send(finddata);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })