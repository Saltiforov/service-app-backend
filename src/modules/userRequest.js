const db = require('../db');

exports.createUserRequest = async (req, res) => {
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
}

exports.getUserRequests = async (req, res) => {
    const query = 'SELECT * FROM mydb.user_request';
    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error)
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json({ data: results });
        }
    });
}


exports.getUserListForSelection =  async (req, res) => {
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
}
