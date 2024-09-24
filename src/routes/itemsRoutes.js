const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const itemModel = require("../models/itemsModel");

// Endpoint untuk menambah item
router.post("/items", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const item = await itemModel.addItem(
      req.body.name,
      req.body.type,
      req.body.stock
    );

    // URL yang akan ditampilkan saat QR Code dipindai
    const qrData = `http://localhost:5000/items/s/${item.secretCode}`;

    // Memastikan folder qrcodes ada satu tingkat di atas
    const dir = path.join(__dirname, "../../qrcodes");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Menghasilkan QR Code
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error("Error generating QR Code:", err);
        return res.status(500).send(err.message);
      }

      // Mengambil data base64 dari URL
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      const filePath = path.join(dir, `${item.secretCode}.png`); // Mundur satu tingkat

      // Menyimpan gambar ke disk
      fs.writeFile(filePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error saving QR Code:", err);
          return res.status(500).send(err.message);
        }

        // Mengembalikan respons dengan item dan informasi QR code
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
});

// Endpoint untuk mendapatkan semua item
router.get("/items", async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint untuk menghasilkan QR code dari secretCode item
// router.get("/items/s/qrcode/:secretCode", async (req, res) => {
//   try {
//     const item = await itemModel.getItemBySecretCode(req.params.secretCode);
//     if (!item) return res.status(404).send("Item not found");

//     // URL yang akan ditampilkan saat QR Code dipindai
//     const qrData = `http://localhost:5000/items/s/${item.secretCode}`;

//     // Menghasilkan QR Code
//     QRCode.toDataURL(qrData, async (err, url) => {
//       if (err) return res.status(500).send(err);

//       // Mengambil data base64 dari URL
//       const base64Data = url.replace(/^data:image\/png;base64,/, "");
//       const filePath = path.join(
//         __dirname,
//         "..",
//         "qrcodes",
//         `${item.secretCode}.png`
//       );

//       // Menyimpan gambar ke disk
//       fs.writeFile(filePath, base64Data, "base64", (err) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: "QR Code saved", filePath });
//       });
//     });
//   } catch (err) {
//     console.error("Error generating QR Code:", err);
//     res.status(500).send(err.message);
//   }

//   const dir = path.join(__dirname, "..", "qrcodes");
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir);
//   }
// });

// Endpoint untuk mendapatkan item berdasarkan secretCode
router.get("/items/s/:secretCode", async (req, res) => {
  try {
    const item = await itemModel.getItemBySecretCode(req.params.secretCode);
    if (!item) return res.status(404).send("Item not found");

    res.json(item); // Mengembalikan data item
  } catch (err) {
    console.error("Error fetching item by secretCode:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint untuk memperbarui item
// router.put("/items/:id", async (req, res) => {
//   try {
//     const updated = await itemModel.updateItem(req.params.id, req.body);
//     if (!updated) return res.status(404).send("Item not found");
//     res.send("Item updated successfully");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Endpoint untuk menghapus item
// router.delete("/items/:id", async (req, res) => {
//   try {
//     const deleted = await itemModel.deleteItem(req.params.id);
//     if (!deleted) return res.status(404).send("Item not found");
//     res.send("Item deleted successfully");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

module.exports = router;
