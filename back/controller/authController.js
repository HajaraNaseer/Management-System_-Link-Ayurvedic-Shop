const db = require('../Database/DB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const secretKey = process.env.SECRET_KEY

const signin = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Input email and Password" });
    }

    const sqlCheck = "SELECT * FROM user WHERE email = ?"
    db.query(sqlCheck, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(200).json({ status: false, message: "Email not registered" });
        } else {
            const hashPassword = result[0].password
            bcrypt.compare(password, hashPassword,(err, match) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Error in password hashing" });
                } else if (!match) {
                    return res.status(200).json({ status: false, message: "Password is wrong" });
                } else {
                    const user = {
                        id: result[0].id,
                        name: result[0].name,
                        role: result[0].role
                    }
                    const token = jwt.sign(user, secretKey, { expiresIn: '1d' })
                    res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000 , httpOnly : true})
                    return res.status(200).json({ status: true })
                }
            })
        }
    })
}

const verify = (req,res) => {
    const token = req.cookies.token
    if(!token){
        res.status(400).json({status:false,message:"Cookie is missing"})
    }
    jwt.verify(token,secretKey,(err,result)=>{
        if (err || !result) {
            res.clearCookie('token');
            return res.status(400).json({ status: false, message: "Error in Cookie" });
        }
        const user = jwt.decode(token)
        if(!user){
            return res.status(400).json({ status: false, message: "Error in decoding cookie" });
        }
        return res.status(200).json({ status: true, data : user });
    });
}

const changePassword = (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ status: false, message: "Input Id and Password" });
    }

    const sqlCheck = "SELECT * FROM user WHERE id = ?";
    db.query(sqlCheck, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(400).json({ status: false, message: "Input a valid user id" });
        }

        bcrypt.hash(password, 10, (err, hashPassword) => {
            if (err) {
                return res.status(400).json({ status: false, message: "Error in password hashing" });
            }

            const sqlUpdate = "UPDATE user SET password = ? WHERE id = ?";
            db.query(sqlUpdate, [hashPassword, userId], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: err });
                } else if (result.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Password changed Successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Database Update Error" });
                }
            });
        });
    });
};

const logout = (req,res) => {
    res.clearCookie('token')
    return res.status(200).json({ status: true, message : "Logout Successful" });
}

const authController = {
    signin,
    verify,
    changePassword,
    logout
}

module.exports = authController