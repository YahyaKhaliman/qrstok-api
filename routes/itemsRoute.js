// routes/itemsRoutes.js
const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemController");

// Endpoint untuk menambah item
router.post("/items", itemsController.addItem);

// Endpoint untuk mendapatkan semua item
router.get("/items", itemsController.getAllItems);

// Endpoint untuk mendapatkan total stock
router.get("/items/total-stock", itemsController.getTotalStock);

// Endpoint untuk mendapatkan item berdasarkan secretCode
router.get("/items/s/:secretCode", itemsController.getItemBySecretCode);

// Uncomment these lines if you want to include update and delete functionality
// router.put("/items/:id", itemsController.updateItem);
// router.delete("/items/:id", itemsController.deleteItem);

module.exports = router;
