const db = require('../Database/DB');
const bcrypt = require('bcrypt');

require('dotenv').config()

const register = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ status: false, message: "Input Name, Email, Password, and Role" });
    }

    const validRoles = ['ADMIN', 'CASHIER', 'INVENTORY'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ status: false, message: "Invalid Role" });
    }

    const sqlEmail = "SELECT * FROM user WHERE email = ?";
    db.query(sqlEmail, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length > 0) {
            return res.status(200).json({ status: false, message: "Email already exists" });
        }

        bcrypt.hash(password, 10, (err, hashPassword) => {
            if (err) {
                return res.status(500).json({ status: false, message: "Error in password hashing" });
            }

            const sqlRegister = "INSERT INTO user(name, email, password, role, created_at) VALUES(?, ?, ?, ?, NOW())";
            db.query(sqlRegister, [name, email, hashPassword, role], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: err });
                } else if (result.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Registered Successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Database Insert Error" });
                }
            });
        });
    });
};

const getUser = (req, res) => {
    const sqlGet = "SELECT * FROM user"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result });
        }
    })
}

const getAdminCount = (req, res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'ADMIN'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}
const getCashierCount = (req, res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'CASHIER'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const getInventoryCount = (req, res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'INVENTORY'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const adminController = {
    register,
    getUser,
    getAdminCount,
    getCashierCount,
    getInventoryCount
}
module.exports = adminController