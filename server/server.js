require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopSearchRouter = require("./routes/shop/search-routes");

mongoose
  .connect(process.env.MANGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders:
      "Content-Type, Authorization, Cache-control, Expires,Pragma",
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter); // Use the auth routes
app.use("/api/admin/products", adminProductsRouter);
// Use the admin products routes
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/address", shopAddressRouter);

app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/search", shopSearchRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
