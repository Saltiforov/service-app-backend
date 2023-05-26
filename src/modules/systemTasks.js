const db = require('../db');

const { v4: uuidv4 } = require('uuid');

exports.createSystemTask = async (req, res) => {
    const { worker_id, request_id, part_id, task_name, start_date, end_date, status, summary } = req.body;
    const task_id = uuidv4(); // Generate a new UUID

    db.query(
        'INSERT INTO mydb.system_task (task_id, worker_id, request_id, part_id, task_name, start_date, end_date, status, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [task_id, worker_id, request_id, part_id, task_name, start_date, end_date, status, summary],
        async (error, results) => {
            if (error) {
                console.log('error', error);
                res.status(500).send('Internal server error');
            } else {
                res.status(200).send('Task created successfully');
            }
        }
    );
};

exports.getSystemTasks = async (req, res) => {
    const { search, worker, status } = req.query;
    console.log('search', search);

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

    try {
        const tasks = await executeQuery(query, values);
        console.log('results', tasks);

        const workerIds = tasks.map((task) => task.worker_id);
        const workers = await getWorkersByWorkerIds(workerIds);

        const partIds = tasks.map((task) => task.part_id);
        const parts = await getPartsByPartIds(partIds);

        tasks.forEach((task) => {
            task.worker = workers[task.worker_id];
            task.part = parts[task.part_id];
        });

        res.status(200).json([...tasks]);
    } catch (error) {
        console.log('error', error);
        res.status(500).send('Internal server error');
    }
};

exports.deleteSystemTask = (req, res) => {
    const taskId = req.params.taskId; // Assuming taskId is passed as a parameter in the request URL

    db.query('DELETE FROM mydb.system_task WHERE task_id = ?', [taskId], (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Task not found');
        } else {
            res.status(200).send('Task deleted successfully');
        }
    });
};




// Helper function to execute a database query
const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Helper function to get workers by worker IDs
const getWorkersByWorkerIds = async (workerIds) => {
    const workerQuery = 'SELECT * FROM mydb.worker WHERE worker_code IN (?)';
    const workerResults = await executeQuery(workerQuery, [workerIds]);

    const workers = {};
    workerResults.forEach((worker) => {
        workers[worker.worker_code] = {
            id: worker.worker_code,
            name: worker.user_name,
        };
    });

    return workers;
};

// Helper function to get parts by part IDs
const getPartsByPartIds = async (partIds) => {
    const partQuery = 'SELECT * FROM mydb.parts WHERE part_id IN (?)';
    const partResults = await executeQuery(partQuery, [partIds]);

    const parts = {};
    partResults.forEach((part) => {
        parts[part.part_id] = {
            id: part.part_id,
            part_name: part.part_name,
            // Add other properties of the part as needed
        };
    });

    return parts;
};