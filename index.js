const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgtwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send('This is Server for Assinment-11.')
})

async function run(){
    try{
        await client.connect();
        console.log('database connected');
        const database = client.db("Services");
        const servicesCollection = database.collection("Service");
        const orderCollection = database.collection("Orders");

        //Load API 
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find({}).toArray();
            res.send(result);
        })
        //Load Single API 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id :ObjectId(id)}
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })
        // Add Orders API
        app.post('/order', async (req, res) => {
            const orders = req.body;
            console.log(orders);
            const result = await orderCollection.insertOne(orders);
            res.send(result);
            console.log(result);
        })
        
        // get my orders
        app.get('/myorder/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const result = await orderCollection.find({ email : email }).toArray();
            res.send(result);
        })
        // get all orders
        app.get('/allorder', async (req, res) => {
            const result = await orderCollection.find().toArray();
            res.send(result);
        })
        // delete form all order
        app.delete('/deleteaddOrdre/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id :ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })
        // delete order
        app.delete('/deleteOrde/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id :ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        
    }
    finally{
        // await client.close();
    }

}run().catch(console.dir);


app.listen(port, () => {
    console.log('Running the Server on Port', port);
})