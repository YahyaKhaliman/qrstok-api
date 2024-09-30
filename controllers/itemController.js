// controllers/itemsController.js
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const itemModel = require("../models/itemsModel");

// Function to add item and generate QR Code
const addItem = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    // Generate a secret code and QR code path here
    const secretCode = itemModel.generateSecretCode();
    const qrData = `https://qrstok-api.my.id/items/s/${secretCode}`;
    const dir = path.join(__dirname, "../public/qrcodes");

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Generate QR Code and save it as a file
    QRCode.toDataURL(qrData, async (err, url) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return res.status(500).send(err.message);
      }

      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      const filePath = path.join(dir, `${secretCode}.png`);

      // Save the QR code file
      fs.writeFile(filePath, base64Data, "base64", async (err) => {
        if (err) {
          console.error("Error saving QR Code:", err);
          return res.status(500).send(err.message);
        }

        // Create a relative path for the QR code including 'public'
        const relativePath = `public/qrcodes/${secretCode}.png`;

        // Now call the model to add the item with the relative QR code path
        const itemResponse = await itemModel.addItem(
          req.body.name,
          req.body.type,
          req.body.stock,
          relativePath // Pass the relative QR code file path
        );

        // Send the response from the model
        res.status(201).json(itemResponse);
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

// Function to get total stock
const getTotalStock = async (req, res) => {
  try {
    const totalStock = await itemModel.getTotalStock();
    res.json({ totalStock });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addItem,
  getAllItems,
  getTotalStock,
  getItemBySecretCode,
};
