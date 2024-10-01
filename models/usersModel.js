const connection = require("../config/db");
const bcrypt = require("bcrypt");

const usernameExists = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    connection.query(sql, [username], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};

const addUser = async (username, password) => {
  const exists = await usernameExists(username);
  if (exists) {
    throw new Error("Username already exists");
  }

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);

      const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
      connection.query(sql, [username, hashedPassword], (err, results) => {
        if (err) return reject(err);
        resolve({
          id: results.insertId,
          username,
        });
      });
    });
  });
};

const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    connection.query(sql, [username], async (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return reject(new Error("User not found"));
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return reject(new Error("Invalid password"));
      }

      resolve({
        id: user.id,
        username: user.username,
      });
    });
  });
};

module.exports = {
  addUser,
  loginUser,
};
