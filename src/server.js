import express from 'express'
const bp = require('body-parser')

const app = express();
app.use(bp.json());

const serverPort = 8000;


app.get('/api/products', (req, res) => {
    res.status(200).json(products)
})

app.listen(serverPort, () => {
    console.log(`Example app listening at http://localhost:${serverPort}`)
})

const products = [
    {
        "id": 1,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 2,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "in progress"
    },
    {
        "id": 3,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "pending"
    },
    {
        "id": 4,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "completed"
    },
    {
        "id": 5,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 6,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 7,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 8,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 9,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
    {
        "id": 10,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": "new"
    },
];




// app.get('/hello', (req, res) => { // basic api route
//     res.send('Hello')
// })
//
// app.get('/hello/:name', (req, res) => {
//     res.send(`Hello ${req.params.name}`)
// })
//
// app.post('/apple', (req, res) => {
//     res.send(`Hello ${req.body.name}`)
// })
