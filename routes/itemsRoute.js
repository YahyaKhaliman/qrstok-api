const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const upload = require("../middleware/multer");

// router.post("", itemsController.addItem);
router.post("/", upload.single("image"), itemsController.addItem);

router.get("/", itemsController.getAllItems);

router.get("/s/:secretCode", itemsController.getItemBySecretCode);

router.get("/total-stock", itemsController.getTotalStock);

// router.put("/items/:id", itemsController.updateItem);
// router.delete("/items/:id", itemsController.deleteItem);

module.exports = router;
