const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello there! welcome to the clothStore')
})

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6itix.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("clothStore").collection("items");
    const reviewCollection = client.db("clothStore").collection("review");
    const orderCollection = client.db("clothStore").collection("order");

    //   uploading product data to the database
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
            .then((result) => {
                console.log(result.insertedCount > 0)
                res.send(result.insertedCount > 0)
            })
    })
    //   showing product data to the UI 
    app.get('/ShowProduct', (req, res) => {
        productCollection.find({ id: req.params._id })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // uploading the review to the database
    app.post('/UploadReview', (req, res) => {
        const review = req.body
        reviewCollection.insertOne(review)
            .then((result) => {
                console.log(result.insertedCount > 0)
                res.send(result.insertedCount > 0)
            })
    })

    // showing review to the UI 
    app.get('/review', (req, res) => {
        reviewCollection.find({ id: req.params._id })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // oder collection submit to the database
    app.post('/itemOrdered', (req, res)=>{
        const item = req.body
        orderCollection.insertOne(item)
        .then(result =>{
            console.log(result.insertedCount > 0)
            res.send(result.insertedCount > 0)
        })

    })
    // item order showing to the order page 
    app.get('/finalOrder', (req, res) =>{
        orderCollection.find()
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })
    // perform actions on the collection object
    console.log('database connected succesfully')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})