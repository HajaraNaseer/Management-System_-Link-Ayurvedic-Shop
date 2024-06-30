const mysql = require('mysql2')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'HjrNsr123#',
    database : 'management_system'
})

module.exports = db