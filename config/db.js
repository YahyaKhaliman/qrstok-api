const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.local_host,
  user: process.env.local_user,
  password: process.env.local_password,
  database: process.env.local_database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    throw err;
  }
  if (connection) connection.release();
  console.log("Connected to MySQL database");
});

module.exports = pool;