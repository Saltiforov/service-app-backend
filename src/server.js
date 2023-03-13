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
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 2,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "in progress",
            "styles": {
                "background": "#FFD0C2",
                "color": "#B07D6C"
            }
        }
    },
    {
        "id": 3,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "pending",
            "styles": {
                "background": "#EC9999",
                "color": "#BD4242"
            }
        }
    },
    {
        "id": 4,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "completed",
            "styles": {
                "background": "#B7D3B2",
                "color": "#529F16"
            }
        }
    },
    {
        "id": 5,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 6,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 7,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 8,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 9,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
    },
    {
        "id": 10,
        "date": "12/02/22",
        "client": "Bret",
        "category": "Category yre",
        "worker": "MishVinogr",
        "parts": "Roprem",
        "status": {
            "code": "new",
            "styles": {
                "background": "#C2C8FF",
                "color": "#6F79D0"
            }
        }
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
