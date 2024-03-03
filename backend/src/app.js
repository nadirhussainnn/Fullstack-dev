const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config({ path: "src/config/config.env" });
const connectDB = require("./db/connection");
connectDB();
const paymentRoutes = require("./routes/payment");
const errorMiddleware = require("./middleware/errors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/payment", paymentRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
