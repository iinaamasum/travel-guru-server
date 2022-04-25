const { application } = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbnu9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  // client.close();
});

async function run() {
  try {
    await client.connect();
    const ticketCollection = client.db('travel-guru').collection('tickets');

    //get api to read all tickets
    // link: http://localhost:4000/tickets
    app.get('/tickets', async (req, res) => {
      const q = req.query;
      console.log(q); //q is representing the query which is an empty object and so returns all of the result.

      const cursor = ticketCollection.find(q);

      const result = await cursor.toArray();

      res.send(result);
    });

    //post api to send data to server
    // link: http://localhost:4000/ticket

    app.post('/ticket', async (req, res) => {
      const data = req.body;
      console.log(data);

      //the data is an json format send by api from client

      const result = await ticketCollection.insertOne(data);
      console.log('sending title to server');
      res.send(data);
    });

    // delete apt
    // link: http://localhost:4000/ticket/62662de488c7b855fb096947
    app.delete('/ticket/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      // console.log(id);

      const result = await ticketCollection.deleteOne(filter);
      res.send(result);
    });
    // put api
    // link: http://localhost:4000/ticket/626634776ee53aba74794f21
    app.put('/ticket/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const data = req.body;
      const filter = { _id: ObjectId(id) };

      const newData = {
        $set: data,
      };

      console.log(data);

      const options = { upsert: true };
      const result = await ticketCollection.updateOne(filter, newData, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
      res.send(result);
    });

    console.log('db running');
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express app listening at ${port}`);
});

app.get('/', async (res, req) => {});
