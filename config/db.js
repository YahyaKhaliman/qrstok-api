const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: process.env.local_host,
//   user: process.env.local_user,
//   password: process.env.local_password,
//   database: process.env.local_database,
// });
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

module.exports = connection;
