require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logs = require("./middleware/logs");
const itemsRoutes = require("./routes/itemsRoute");
const usersRoutes = require("./routes/usersRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(logs);
app.use("/items", itemsRoutes);
app.use(usersRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API qrstok Ready",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
