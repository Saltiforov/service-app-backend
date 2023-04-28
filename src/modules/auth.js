const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.createNewUser = async (req, res) => {
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
}

exports.login = async (req, res) => {
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
}
