const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

app.listen(config.serverPort, () => {
    console.log(`Server started on port ${config.serverPort}`);
});

app.get('/api/products', (req, res) => {
    res.status(200).json(products)
})

app.post('/api/login', async (req, res) => { //REGISTER METHOD
    const { password, first_name, last_name, email, phone, role } = req.body;

    const permission_code = 23132; // set permission code based on your business logic

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO mydb.worker (permission_code, first_name, last_name, email, phone, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [permission_code, first_name, last_name, email, phone, role, hashedPassword], (error, results) => {
            if (error) {
                console.log('error', error)
                res.status(500).send('Internal server error');
            } else {
                console.log('result ', results)
                res.status(200).send('Worker created successfully');
            }
        });
});

app.get('/api/permissions', (req, res) => {
    db.query('SELECT * FROM mydb.permissions', (error, results) => {
        if (error) {
            console.error('Error retrieving permissions from database', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving permissions from the database'
            });
        }
        return res.status(200).json(results);
    });
});

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

