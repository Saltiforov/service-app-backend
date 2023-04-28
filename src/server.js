const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
const secretKey = 'your-secret-key-here';
app.listen(config.serverPort, () => {
    console.log(`Server started on port ${config.serverPort}`);
});
const userRequestModule = require('./modules/userRequest');
const userModule = require('./modules/worker');
const authModule = require('./modules/auth');
const partsModule = require('./modules/parts');
const systemTaskModule = require('./modules/systemTasks');

app.post('/api/user-request', userRequestModule.createUserRequest);

app.post('/api/login', authModule.login);

app.post('/api/register', authModule.createNewUser);

app.post('/api/new-task', systemTaskModule.createSystemTask);

app.post('/api/parts', partsModule.createNewPart);

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

app.get('/api/user-request', userRequestModule.getUserRequests);

app.get('/api/parts', partsModule.getPartsList);

app.get('/api/users', userModule.getUsers);

app.get('/api/parts-list', partsModule.getPartsListForSelection);

app.get('/api/user-requests-list', userRequestModule.getUserListForSelection);

app.get('/api/system-tasks', systemTaskModule.getSystemTasks);