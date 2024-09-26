// controllers/itemsController.js
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const itemModel = require("../models/itemsModel");

// Function to add item and generate QR Code
const addItem = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const item = await itemModel.addItem(
      req.body.name,
      req.body.type,
      req.body.stock
    );

    const qrData = `http://localhost:5000/items/s/${item.secretCode}`;
    const dir = path.join(__dirname, "../public/qrcodes");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return res.status(500).send(err.message);
      }

      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      const filePath = path.join(dir, `${item.secretCode}.png`);

      fs.writeFile(filePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error saving QR Code:", err);
          return res.status(500).send(err.message);
        }

        res.status(201).json({
          item,
          message: "QR Code created and saved",
          filePath,
        });
      });
    });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).send(err.message);
  }
};

// Function to get all items
const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Function to get total stock
const getTotalStock = async (req, res) => {
  try {
    const totalStock = await itemModel.getTotalStock();
    res.json({ totalStock });
  } catch (err) {
    console.error("Error getting total stock:", err);
    res.status(500).send(err.message);
  }
};

// Function to get item by secret code
const getItemBySecretCode = async (req, res) => {
  try {
    const item = await itemModel.getItemBySecretCode(req.params.secretCode);
    if (!item) return res.status(404).send("Item not found");

    res.json(item);
  } catch (err) {
    console.error("Error fetching item by secretCode:", err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  addItem,
  getAllItems,
  getTotalStock,
  getItemBySecretCode,
};
