const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const upload = require("../middleware/multer");

router.post("/", upload.single("image"), itemsController.addItem);

router.get("/", itemsController.getAllItems);

router.get("/s/:secretCode", itemsController.getItemBySecretCode);

router.get("/total-stock", itemsController.getTotalStock);

router.get("/type", itemsController.getAllType);

router.get("/type/:type", itemsController.getItemByType);

// router.put("/items/:id", itemsController.updateItem);
// router.delete("/items/:id", itemsController.deleteItem);

module.exports = router;
