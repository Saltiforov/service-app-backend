// serviceController.js

const db = require('../db');

exports.getServices = (req, res) => {
    const query = 'SELECT * FROM mydb.service';

    db.query(query, (error, results) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const formattedResults = results.map((result) => ({
                id: result.id,
                name: `${result.name} with price ($ ${result.price})`
            }));

            res.status(200).json(formattedResults);
        }
    });
};
