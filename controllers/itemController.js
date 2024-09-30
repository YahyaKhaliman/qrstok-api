// controllers/itemsController.js
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const itemModel = require("../models/itemsModel");

// Function to add item and generate QR Code
const addItem = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    // Menambahkan item ke dalam database
    const item = await itemModel.addItem(
      req.body.name,
      req.body.type,
      req.body.stock
    );

    const qrData = `https://qrstok-api.my.id/items/s/${item.secretCode}`;
    const dir = path.join(__dirname, "../public/qrcodes");

    // Memeriksa apakah direktori untuk menyimpan QR Code ada, jika tidak buat
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Membuat QR Code
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return res.status(500).send(err.message);
      }

      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      const filePath = path.join(dir, `${item.secretCode}.png`);

      // Menyimpan QR Code sebagai file PNG
      fs.writeFile(filePath, base64Data, "base64", async (err) => {
        if (err) {
          console.error("Error saving QR Code:", err);
          return res.status(500).send(err.message);
        }

        try {
          // Setelah QR Code berhasil disimpan, update item di database untuk menyimpan path qrCode
          const qrCodePath = `/public/qrcodes/${item.secretCode}.png`;

          // Update database dengan path QR Code
          await itemModel.updateQrCode(item.id, qrCodePath);

          res.status(201).json({
            item,
            message: "QR Code created, saved, and path stored in database",
            qrCodePath,
          });
        } catch (dbError) {
          console.error("Error updating item with QR Code path:", dbError);
          res.status(500).send(dbError.message);
        }
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
