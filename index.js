const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hm5vc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourism_website');
        const packageCollection = database.collection('packages');
        const trvallersBooking = database.collection('travellers_booking');
        const specificTravellerBooking = database.collection('specific_traveller_booking');

        // GET PACKAGES API
        app.get('/packages', async(req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // GET ALL BOOKINGS
        app.get('/allbookings', async(req, res) =>{
            const cursor = trvallersBooking.find({});
            const allBookings = await cursor.toArray();
            res.send(allBookings);
        })

        // GET SPECIFIC BOOKINGS
        app.get('/mybookings/:email', async(req, res)=>{
            const cursor = specificTravellerBooking.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // POST ALL TRAVELLERS TRIP
        app.post('/traveller', async(req, res) =>{
            const newTraveller = req.body;
            const result = await trvallersBooking.insertOne(newTraveller);
            res.json(result);
        })

        // POST ADD NEW PACKAGE
        app.post('/packages', async(req, res)=>{
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.json(result);
        })

        // UPDATE STATUS
        app.put('/allbookings/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const update = {
                $set: {
                    status: "Approved"
                }
            };
            const result = await trvallersBooking.updateOne(query, update);
            res.json(result);
        })

        // DELETE TRIP
        app.delete('/allbookings/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('deleting user with id', id);
            const query = {_id: ObjectId(id)};
            const result = await trvallersBooking.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => res.send('Tourism Server is running'));
app.listen(port, () => console.log('Tourism server is running on port', port));