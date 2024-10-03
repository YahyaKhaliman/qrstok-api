const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const itemModel = require("../models/itemsModel");

const addItem = async (req, res) => {
  try {
    const secretCode = itemModel.generateSecretCode();
    const imageName = req.body.name.replace(/[^a-zA-Z0-9_-]/g, "_");

    const qrData = `https://qrstok-api.my.id/items/s/${secretCode}`;

    const dir = path.join(__dirname, "../public/qrcodes");
    const dirImage = path.join(__dirname, "../public/images");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(dirImage)) {
      fs.mkdirSync(dirImage, { recursive: true });
    }

    const qrCodePath = path.join(dir, `${secretCode}.png`);
    const qrOptions = {
      type: "png",
      quality: 0.92,
      width: 500,
      margin: 1,
    };

    await QRCode.toFile(qrCodePath, qrData, qrOptions);

    const relativeQrCodePath = `public/qrcodes/${secretCode}.png`;

    let imagePath = null;
    if (req.file) {
      imagePath = path.join(dirImage, `${imageName}.jpg`);
      await fs.promises.copyFile(req.file.path, imagePath);
      imagePath = `public/images/${imageName}.jpg`;
    }

    const itemResponse = await itemModel.addItem(
      req.body.name,
      req.body.type,
      req.body.stock,
      secretCode,
      relativeQrCodePath,
      req.body.size,
      req.body.color,
      req.body.price,
      imagePath
    );

    res.status(201).json(itemResponse);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).send({ error: "An error occurred while adding the item." });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

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
