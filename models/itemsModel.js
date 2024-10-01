const connection = require("../config/db");

// Fungsi untuk menghasilkan secretCode 9 digit
const generateSecretCode = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString(); // Menghasilkan angka 9 digit
};

// Fungsi untuk menambah item
const addItem = (name, type, stock, secretCode, qrCode) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO items (name, type, stock, secretCode, qrCode) VALUES (?, ?, ?, ?, ?)";

    connection.query(
      sql,
      [name, type, stock, secretCode, qrCode], // Use the passed secretCode and qrCode
      (err, results) => {
        if (err) return reject(err);

        const formatResults = {
          status: "success",
          message: "Item added successfully",
          data: {
            id: results.insertId,
            name,
            type,
            stock,
            secretCode,
            qrCode, // Ensure this matches the stored path
          },
        };
        resolve(formatResults);
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
        data: results.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          stock: item.stock,
          secretCode: item.secretCode,
          qrCode: item.qrCode,
        })),
      };
      resolve(formatResults);
    });
  });
};

// Fungsi untuk mendapatkan item berdasarkan ID
const getItemBySecretCode = (secretCode) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items WHERE secretCode = ?";
    connection.query(sql, [secretCode], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const item = {
        status: "success",
        message: "Item found",
        data: {
          id: results[0].id,
          name: results[0].name,
          type: results[0].type,
          stock: results[0].stock,
          secretCode: results[0].secretCode,
          qrCode: results[0].qrCode,
        },
      };
      resolve(item);
    });
  });
};

const getTotalStock = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT SUM(stock) AS totalStock FROM items";
    connection.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].totalStock);
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

module.exports = {
  addItem,
  getAllItems,
  getTotalStock,
  generateSecretCode,
  // updateItem,
  // deleteItem,
  getItemBySecretCode,
};
