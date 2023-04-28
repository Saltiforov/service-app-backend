const db = require('../db');

exports.createSystemTask = async (req, res) => {
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
}


exports.getSystemTasks = async (req, res) => {
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
}