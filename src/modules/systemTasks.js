const db = require('../db');

const { v4: uuidv4 } = require('uuid');
// Function to fetch service information by id
const getServiceById = (serviceId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM mydb.service WHERE id = ?', [serviceId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};

exports.createSystemTask = async (req, res) => {
    const { worker_id, request_id, part_id, task_name, start_date, end_date, status, summary, service } = req.body;
    const task_id = uuidv4(); // Generate a new UUID

    // Check if the service field is already an object
    const parsedService = typeof service === 'object' ? service : JSON.parse(service);

    try {
        // Retrieve the service information from the service table using the provided service id
        const selectedService = await getServiceById(parsedService.id);

        db.query(
            'INSERT INTO mydb.system_task (task_id, worker_id, request_id, part_id, task_name, start_date, end_date, status, summary, service) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [task_id, worker_id, request_id, part_id, task_name, start_date, end_date, status, summary, JSON.stringify(selectedService)],
            (error, results) => {
                if (error) {
                    console.log('error', error);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(200).send('Task created successfully');
                }
            }
        );
    } catch (error) {
        console.log('error', error);
        res.status(500).send('Internal server error');
    }
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

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const { service } = task;

            // Convert the service field to an object with only id and name
            if (service) {
                const { id, name } = JSON.parse(service);
                task.service = { id, name };

                // Fetch the updated service information from the service table
                const updatedService = await getServiceById(id);
                console.log('updatedService', updatedService);
                if (updatedService) {
                    task.service = {
                        id: updatedService.id,
                        name: `${updatedService.name} with price ($ ${updatedService.price})`,
                    };
                }
            }

            task.worker = workers[task.worker_id];
            task.part = parts[task.part_id];
        }

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

exports.editSystemTask = async (req, res) => {
    const { task_id, worker_id, request_id, part_id, task_name, start_date, end_date, status, summary, service } = req.body;

    // Retrieve the service information from the service table based on the service ID
    const getServiceQuery = 'SELECT * FROM mydb.service WHERE id = ?';
    db.query(getServiceQuery, [service.id], async (error, serviceResult) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const updatedService = {
                id: serviceResult[0].id,
                name: serviceResult[0].name,
                price: serviceResult[0].price,
                description: serviceResult[0].description,
            };

            db.query(
                'UPDATE mydb.system_task SET worker_id = ?, request_id = ?, part_id = ?, task_name = ?, start_date = ?, end_date = ?, status = ?, summary = ?, service = ? WHERE task_id = ?',
                [worker_id, request_id, part_id, task_name, start_date, end_date, status, summary, JSON.stringify(updatedService), task_id],
                async (error, results) => {
                    if (error) {
                        console.log('error', error);
                        res.status(500).send('Internal server error');
                    } else {
                        res.status(200).send('Task updated successfully');
                    }
                }
            );
        }
    });
};





// GET route to retrieve worker statistics
exports.getReportStatistic = async (req, res) => {
    const query = `
    SELECT w.worker_code, w.user_name, COUNT(st.task_id) AS taskCount
    FROM mydb.worker AS w
    LEFT JOIN mydb.system_task AS st ON w.worker_code = st.worker_id
    GROUP BY w.worker_code, w.user_name
  `;

    db.query(query, (error, results) => {
        console.log('results', results)
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const statistics = results.map((row) => ({
                workerCode: row.worker_code,
                userName: row.user_name,
                taskCount: row.taskCount,
            }));
            res.status(200).json(statistics);
        }
    });
}

// app.get('/api/request-status',
// Back-end route
exports.getReportStatusInfo = async (req, res) => {
    try {
        const query = 'SELECT status, COUNT(*) as count FROM mydb.system_task GROUP BY status';
        db.query(query, (error, results) => {
            if (error) {
                console.log('error', error);
                res.status(500).send('Internal server error');
            } else {
                const requestStatus = Array.isArray(results)
                    ? results.map((result) => ({
                        status: result.status,
                        count: result.count,
                    }))
                    : [];

                res.status(200).json(requestStatus);
            }
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).send('Internal server error');
    }
};
