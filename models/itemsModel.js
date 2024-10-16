const connection = require("../config/db");

const generateSecretCode = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const addItem = (
  name,
  type,
  stock,
  secretCode,
  qrCode,
  size,
  color,
  price,
  image,
  description
) => {
  return new Promise((resolve, reject) => {
    if (
      !name ||
      !type ||
      !stock ||
      !size ||
      !color ||
      !price ||
      !image ||
      !description
    ) {
      const errorMessage =
        "Fields 'name', 'type', 'stock', 'size', 'color', 'price', 'image', and 'description' are required.";
      return reject(new Error(errorMessage));
    }

    if (isNaN(stock) || isNaN(price)) {
      const errorMessage = "Stock and price must be valid numbers.";
      console.error(errorMessage);
      return reject(new Error(errorMessage));
    }

    const validSizes = ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
    const upperCaseSize = size.toUpperCase();

    if (!validSizes.includes(upperCaseSize)) {
      const errorMessage = `Size must be one of the following: ${validSizes.join(
        ", "
      )}`;
      console.error(errorMessage);
      return reject(new Error(errorMessage));
    }

    const sql =
      "INSERT INTO items (name, type, stock, secretCode, qrCode, size, color, price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(
      sql,
      [
        name,
        type,
        stock,
        secretCode,
        qrCode,
        upperCaseSize,
        color,
        price,
        image,
        description,
      ],
      (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }

        const formattedResult = {
          status: "success",
          message: "Item added successfully",
          data: {
            id: results.insertId,
            name,
            type,
            stock,
            secretCode,
            qrCode,
            size: upperCaseSize,
            color,
            price,
            image,
            description,
          },
        };
        resolve(formattedResult);
      }
    );
  });
};

const getAllItems = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items";
    connection.query(sql, (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve({
          status: "error",
          message: "Item not found",
          data: null,
        });
      }

      const formattedResults = {
        status: "success",
        message: "List of all items",
        data: results.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          stock: item.stock,
          secretCode: item.secretCode,
          qrCode: item.qrCode,
          color: item.color,
          size: item.size,
          price: item.price,
          image: item.image,
          description: item.description,
        })),
      };
      resolve(formattedResults);
    });
  });
};

const getItemBySecretCode = (secretCode) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items WHERE secretCode = ?";
    connection.query(sql, [secretCode], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve({
          status: "error",
          message: "Item not found",
          data: null,
        });
      }

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
          color: results[0].color,
          size: results[0].size,
          price: results[0].price,
          image: results[0].image,
          description: results[0].description,
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

      if (results.length === 0) {
        return resolve({
          status: "error",
          message: "Total stock not found",
          data: null,
        });
      }

      resolve({
        status: "success",
        message: "Total stock",
        data: results[0].totalStock,
      });
    });
  });
};

const getAllType = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT type FROM items";
    connection.query(sql, (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve({
          status: "error",
          message: "No types found",
          data: null,
        });
      }

      const types = results.map((row) => row.type);
      resolve({
        status: "success",
        message: "List all category",
        data: types,
      });
    });
  });
};

const getItemByType = (type) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM items WHERE type = ?";
    connection.query(sql, [type], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve({
          status: "error",
          message: `No items found for : ${type}`,
          data: null,
        });
      }

      const formattedResults = {
        status: "success",
        message: `${results.length} item(s) found for category: ${type}`,
        data: results.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          stock: item.stock,
          secretCode: item.secretCode,
          qrCode: item.qrCode,
          color: item.color,
          size: item.size,
          price: item.price,
          image: item.image,
          description: item.description,
        })),
      };
      resolve(formattedResults);
    });
  });
};

const updateItem = (
  id,
  name,
  type,
  stock,
  secretCode,
  qrCode,
  size,
  color,
  price,
  image,
  description
) => {
  console.log(
    id,
    name,
    type,
    stock,
    secretCode,
    qrCode,
    size,
    color,
    price,
    image,
    description
  );

  return new Promise((resolve, reject) => {
    if (!name || !type || !stock || !size || !color || !price || !description) {
      const errorMessage =
        "Fields 'name', 'type', 'stock', 'size', 'color', 'price', and 'description' are required.";
      return reject(new Error(errorMessage));
    }

    if (isNaN(stock) || isNaN(price)) {
      const errorMessage = "Stock and price must be valid numbers.";
      console.error(errorMessage);
      return reject(new Error(errorMessage));
    }

    const validSizes = ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
    const upperCaseSize = size.toUpperCase();
    if (!validSizes.includes(upperCaseSize)) {
      const errorMessage = `Size must be one of the following: ${validSizes.join(
        ", "
      )}`;
      console.error(errorMessage);
      return reject(new Error(errorMessage));
    }

    const sqlGetOldImage = "SELECT name, image FROM items WHERE id = ?";
    connection.query(sqlGetOldImage, [id], (err, results) => {
      if (err) {
        console.error("Error fetching old image:", err);
        return reject(err);
      }

      if (results.length === 0) {
        return reject(new Error("Item not found."));
      }

      const oldImage = results[0].image;
      const oldName = results[0].name;

      // Menghasilkan nama baru berdasarkan name
      const newImageName = `${name.replace(/\s+/g, "_").toLowerCase()}.jpg`; // Ubah sesuai dengan ekstensi file yang Anda gunakan

      const sql =
        "UPDATE items SET name = ?, type = ?, stock = ?, color = ?, size = ?, price = ?, description = ?" +
        (image ? ", image = ?" : "") +
        " WHERE id = ?";

      const params = [
        name,
        type,
        stock,
        color,
        upperCaseSize,
        price,
        description,
      ];

      // Update params jika ada gambar baru
      if (image) {
        params.push(image);
      } else {
        params.push(oldImage); // Tetap menggunakan oldImage jika tidak ada gambar baru
      }
      params.push(id);

      connection.query(sql, params, (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }

        if (results.affectedRows === 0) {
          return resolve({
            status: "error",
            message: "Item not found or no changes made.",
          });
        }

        // Ubah nama file gambar jika name berubah dan gambar tidak diubah
        if (oldName !== name && !image) {
          const fs = require("fs");
          const path = require("path");
          const oldImagePath = path.join(__dirname, "path/to/images", oldImage); // Ubah dengan jalur yang sesuai
          const newImagePath = path.join(
            __dirname,
            "path/to/images",
            newImageName
          );

          // Ubah nama file gambar
          fs.rename(oldImagePath, newImagePath, (err) => {
            if (err) {
              console.error("Error renaming old image:", err);
            }
          });
        }

        const formattedResult = {
          status: "success",
          message: "Item updated successfully",
          data: {
            id,
            name,
            type,
            stock,
            secretCode,
            qrCode,
            size: upperCaseSize,
            color,
            price,
            image: image ? image : newImageName, // Jika gambar baru tidak ada, gunakan nama gambar baru
            description,
          },
        };
        resolve(formattedResult);
      });
    });
  });
};

const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM items WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return resolve({
          status: "error",
          message: "Item not found",
        });
      }

      resolve({
        status: "success",
        message: "Item deleted successfully.",
      });
    });
  });
};

module.exports = {
  addItem,
  getAllItems,
  getTotalStock,
  generateSecretCode,
  getAllType,
  getItemByType,
  updateItem,
  deleteItem,
  getItemBySecretCode,
};
