const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq1fqp2.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // OUR DB
        const servicesCollection = client.db('onlineCarRepair').collection('services');
        const productsCollection = client.db('onlineCarRepair').collection('products');
        const teamCollection = client.db('onlineCarRepair').collection('teams');
        const bookingCollection = client.db('onlineCarRepair').collection('bookings');

        // all services data api
        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // specific single services data api
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        // options services data
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { title: 1, img: 1, price: 1, service_id: 1 },
            };
            const result = await servicesCollection.findOne(query, options);
            res.send(result)
        })


        // all products data api
        app.get('/product', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // all team data api
        app.get('/team', async (req, res) => {
            const cursor = teamCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get the single person booking data api
        app.get('/singlebooking', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // booking delete api
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

        // post all booking data api
        app.post('/order', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        // update booking data
        app.patch('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            // console.log(updatedBooking);
            const updatDoc = {
                $set: {
                    status: updatedBooking.status
                }
            }
            const result = await bookingCollection.updateOne(filter, updatDoc);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('online car repair running')
})

app.listen(port, () => {
    console.log(`online car repair running on port ${port}`)
})