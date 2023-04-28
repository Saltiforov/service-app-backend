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

app.post('/api/user-request', async (req, res) => {
    const { request_id, user_name, email, summary } = req.body;
    const query = 'INSERT INTO mydb.user_request (request_id, user_name, email, summary) VALUES (?, ?, ?, ?)';
    db.query(query, [request_id, user_name, email, summary], (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json({ message: 'User request created successfully.' });
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { password, user_name , first_name, last_name, email, phone, role } = req.body;

    const permission_code = 23132; // set permission code based on your business logic

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO mydb.worker (permission_code, first_name, last_name, email, phone, role, password, user_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [permission_code, first_name, last_name, email, phone, role, hashedPassword, user_name], (error, results) => {
            if (error) {
                console.log('error', error)
                res.status(500).send('Internal server error');
            } else {
                console.log('result ', results)
                res.status(200).send('Worker created successfully');
            }
        });
});

app.post('/api/login', async (req, res) => {
    const { user_name, password } = req.body;

    db.query('SELECT * FROM mydb.worker WHERE user_name = ?', [user_name], async (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else if (results.length == 0) {
            res.status(401).send('Invalid user name or password');
        } else {
            const passwordMatch = await bcrypt.compare(password, results[0].password);
            if (passwordMatch) {
                const worker = results[0]; // get worker information from query results
                delete worker.password;
                console.log('worker', worker)
                const accessToken = jwt.sign({ user_name: user_name, role: 'worker', worker: worker }, secretKey, { expiresIn: '1h' }); // include worker information in token payload
                res.status(200).json({ accessToken: accessToken, worker: worker }); // return worker information along with token
            } else {
                res.status(401).send('Invalid user name or password');
            }
        }
    });
});

app.post('/api/new-task', async (req, res) => {
    const { task_id, worker_id, request_id, task_name, start_date, end_date, status, summary } = req.body;

    db.query('INSERT INTO mydb.system_task (task_id, worker_id, request_id, task_name, start_date, end_date, status, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [task_id, worker_id, request_id, task_name, start_date, end_date, status, summary], async (error, results) => {
            if (error) {
                console.log('error', error);
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send('Task created successfully');
            }
        });
});

app.post('/api/parts', async (req, res) => {
    const { part_id, part_name, part_count, price, description } = req.body;

    const query = 'INSERT INTO mydb.parts (part_id, part_name, part_count, price, description) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [part_id, part_name, part_count, price, description], (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json({ message: 'Part created successfully.', part_id });
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

app.get('/api/user-request', async (req, res) => {
    const query = 'SELECT * FROM mydb.user_request';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json({ data: results });
        }
    });
});

app.get('/api/parts', async (req, res) => {
    const query = 'SELECT * FROM mydb.parts';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json({ data: results });
        }
    });
});

app.get('/api/users', async (req, res) => {
    const query = 'SELECT worker_code, CONCAT(first_name, " ", last_name) AS name FROM mydb.worker';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else {
            const workers = Array.isArray(results) ? results.map((worker) => ({
                id: worker.worker_code,
                name: worker.name
            })) : [];

            res.status(200).json([ ...workers ]);
        }
    });
});

app.get('/api/parts-list', async (req, res) => {
    const query = 'SELECT part_id, part_name FROM mydb.parts';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const parts = Array.isArray(results) ? results.map((part) => ({
                id: part.part_id,
                name: part.part_name
            })) : [];

            res.status(200).json([...parts]);
        }
    });
});

app.get('/api/user-requests-list', async (req, res) => {
    const query = 'SELECT request_id, user_name, email, summary FROM mydb.user_request';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const requests = Array.isArray(results) ? results.map((request) => ({
                id: request.request_id,
                user: request.user_name,
                email: request.email,
                summary: request.summary
            })) : [];

            res.status(200).json([...requests]);
        }
    });
});

app.get('/api/system-tasks', async (req, res) => {
    const { search, worker, status } = req.query;
    let query = 'SELECT * FROM mydb.system_task WHERE 1=1';
    let values = [];

    if (search) {
        query += ' AND task_name LIKE ?';
        values.push(`%${search}%`);
    }

    if (worker) {
        query += ' AND worker_id = ?';
        values.push(worker);
    }

    if (status) {
        query += ' AND status = ?';
        values.push(status);
    }

    db.query(query, values, (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const tasks = Array.isArray(results) ? results.map((task) => ({
                id: task.task_id,
                workerId: task.worker_id,
                requestId: task.request_id,
                partId: task.part_id,
                name: task.task_name,
                startDate: task.start_date,
                endDate: task.end_date,
                status: task.status,
                summary: task.summary
            })) : [];

            res.status(200).json([...tasks]);
        }
    });
});