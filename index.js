const { application } = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

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
      console.log(q);

      const cursor = ticketCollection.find(q);

      const result = await cursor.toArray();

      res.send('hi');
    });

    //get api to read all tickets
    // link: http://localhost:4000/tickets
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
