const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "src/config/config.env" });
const connectDB = require("./db/connection");
connectDB();
const paymentRoutes = require("./routes/payment");

const app = express();
app.use(bodyParser.json());

app.use("/payment", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
