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
      imagePath,
      req.body.description
    );

    res.status(201).json(itemResponse);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the item.",
      error: err.message,
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    if (items.status === "error") {
      return res.status(404).json(items);
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getItemBySecretCode = async (req, res) => {
  try {
    const item = await itemModel.getItemBySecretCode(req.params.secretCode);
    if (item.status === "error") {
      return res.status(404).json(item);
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getTotalStock = async (req, res) => {
  try {
    const totalStock = await itemModel.getTotalStock();
    if (totalStock.status === "error") {
      return res.status(404).json(totalStock);
    }
    res.json(totalStock);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getAllType = async (req, res) => {
  try {
    const types = await itemModel.getAllType();
    if (types.status === "error") {
      return res.status(404).json(types);
    }
    res.json(types);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getItemByType = async (req, res) => {
  try {
    const itemByType = await itemModel.getItemByType(req.params.type);
    if (itemByType.status === "error") {
      return res.status(404).json(itemByType);
    }
    res.json(itemByType);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const updateItem = async (req, res) => {
  console.log(req.body);
  try {
    const secretCode = req.params.secretCode;
    const oldItem = await itemModel.getItemBySecretCode(secretCode);

    if (oldItem.status === "error") {
      return res.status(404).json(oldItem);
    }

    const { name, type, stock, size, color, price, description } = req.body;

    const stockValue = parseFloat(stock);
    const priceValue = parseFloat(price);

    if (isNaN(stockValue) || isNaN(priceValue)) {
      return res.status(400).json({
        status: "error",
        message: "Stock and price must be valid numbers.",
      });
    }

    const imageName = req.file
      ? `public/images/${req.file.filename}`
      : oldItem.data.image;

    const itemUpdate = await itemModel.updateItem(
      oldItem.data.id,
      name,
      type,
      stockValue,
      oldItem.data.secretCode,
      oldItem.data.qrCode,
      size,
      color,
      priceValue,
      imageName,
      description
    );

    if (itemUpdate.status === "error") {
      return res.status(404).json(itemUpdate);
    }

    res.json(itemUpdate);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await itemModel.deleteItem(itemId);

    if (result.status === "error") {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  addItem,
  getAllItems,
  getTotalStock,
  getItemBySecretCode,
  getAllType,
  getItemByType,
  updateItem,
  deleteItem,
};
