const { stat } = require("fs");
const connection = require("../config/db");

// Fungsi untuk menghasilkan secretCode 9 digit
const generateSecretCode = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString(); // Menghasilkan angka 9 digit
};

// Fungsi untuk menambah item
const addItem = (name, type, stock) => {
  const secretCode = generateSecretCode(); // Menggunakan fungsi untuk menghasilkan secretCode
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO items (name, type, stock, secretCode, qrCode) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [name, type, stock, secretCode, qrCode],
      (err, results) => {
        if (err) return reject(err);
        resolve({
          id: results.insertId,
          name,
          type,
          stock,
          secretCode,
          qrCode,
        });
      }
    );
  });
};

// Fungsi untuk mendapatkan semua item
const getAllItems = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items";
    connection.query(sql, (err, results) => {
      if (err) return reject(err);

      const formatResults = {
        status: "success",
        message: "list all items",
        data: results.map((items) => ({
          id: items.id,
          name: items.name,
          type: items.type,
          stock: items.stock,
          secretCode: items.secretCode,
        })),
      };

      resolve(formatResults);
    });
  });
};

// Fungsi untuk mendapatkan item berdasarkan ID
const getItemById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items WHERE id = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

const getTotalStock = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT SUM(stock) AS totalStock FROM items"; // Pastikan nama tabel dan kolom sesuai
    connection.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].totalStock); // Mengembalikan total stock
    });
  });
};

// // Fungsi untuk memperbarui item
// const updateItem = (id, updates) => {
//   return new Promise((resolve, reject) => {
//     const sql = "UPDATE items SET name = ?, type = ?, stock = ? WHERE id = ?";
//     connection.query(
//       sql,
//       [updates.name, updates.type, updates.stock, id],
//       (err, results) => {
//         if (err) return reject(err);
//         if (results.affectedRows === 0) return resolve(null);
//         resolve(true);
//       }
//     );
//   });
// };

// // Fungsi untuk menghapus item
// const deleteItem = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = "DELETE FROM items WHERE id = ?";
//     connection.query(sql, [id], (err, results) => {
//       if (err) return reject(err);
//       if (results.affectedRows === 0) return resolve(null);
//       resolve(true);
//     });
//   });
// };

const getItemBySecretCode = (secretCode) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items WHERE secretCode = ?";
    connection.query(sql, [secretCode], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

module.exports = {
  addItem,
  getAllItems,
  getItemById,
  getTotalStock,
  // updateItem,
  // deleteItem,
  getItemBySecretCode,
};
