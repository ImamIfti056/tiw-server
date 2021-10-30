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

        // POST ALL TRAVELLERS TRIP
        app.post('/traveller', async(req, res) =>{
            const newTraveller = req.body;
            // console.log('got new traveller', req.body);
            const result = await trvallersBooking.insertOne(newTraveller);
            // console.log('added traveller', result);
            res.json(result);
        })

        // POST SPECIFIC TRAVELLER TRIP
        app.post('/traveller/:email', async(req, res) =>{
            console.log('get traveller id', req.params);
            const newTraveller = req.body;
            console.log('got new traveller', req.body);
            const result = await specificTravellerBooking.insertOne(newTraveller);
            console.log('added traveller', result);
            // res.json(result);
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