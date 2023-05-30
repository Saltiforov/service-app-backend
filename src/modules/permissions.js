const db = require('../db');

exports.getAllPermissions = async (req, res) => {
    const query = 'SELECT * FROM mydb.permissions';

    db.query(query, (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            const permissions = Array.isArray(results)
                ? results.map((permission) => ({
                    permission_code: permission.permission_code,
                    permission_name: permission.permission_name,
                    description: permission.description,
                }))
                : [];

            res.status(200).json(permissions);
        }
    });
};

exports.updateWorkerPermission = async (req, res) => {
    const { worker_id, permission_code } = req.body;

    const query = 'UPDATE mydb.worker SET permission_code = ? WHERE worker_code = ?';

    db.query(query, [permission_code, worker_id], async (error, results) => {
        if (error) {
            console.log('error', error);
            res.status(500).send('Internal server error');
        } else {
            // Update the user role based on the permission code
            let role = 'worker';
            if (permission_code === 'service_center.admin') {
                role = 'admin';
            }

            // Update the user role in the database
            const updateRoleQuery = 'UPDATE mydb.worker SET role = ? WHERE worker_code = ?';
            db.query(updateRoleQuery, [role, worker_id], (error, results) => {
                if (error) {
                    console.log('error', error);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(200).send('Worker permission and role updated successfully');
                }
            });
        }
    });
};
