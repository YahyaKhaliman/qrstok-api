const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: process.env.local_host,
//   user: process.env.local_user,
//   password: process.env.local_password,
//   database: process.env.local_database,
// });
const connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10, // Jumlah maksimal koneksi dalam pool
  queueLimit: 0, // Tidak ada batasan antrian
  connectTimeout: 10000, // Timeout koneksi (opsional)
  acquireTimeout: 10000, // Timeout untuk mengambil koneksi dari pool (opsional)
});

connection.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    throw err;
  }
  if (connection) connection.release(); // Koneksi yang berhasil dilepaskan kembali ke pool
  console.log("Connected to MySQL database");
});

module.exports = connection;
