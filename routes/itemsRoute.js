const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");

// Endpoint untuk menambah item
router.post("", itemsController.addItem);

// Endpoint untuk mendapatkan semua item
router.get("", itemsController.getAllItems);

// Endpoint untuk mendapatkan item berdasarkan secretCode
router.get("/s/:secretCode", itemsController.getItemBySecretCode);

// Endpoint untuk mendapatkan total stock
router.get("/total-stock", itemsController.getTotalStock);

// router.put("/items/:id", itemsController.updateItem);
// router.delete("/items/:id", itemsController.deleteItem);

module.exports = router;
