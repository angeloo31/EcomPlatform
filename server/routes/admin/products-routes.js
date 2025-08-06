const multer = require("multer");
const express = require("express");
const router = express.Router();
const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const storage = multer.memoryStorage(); // store in memory to get buffer
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
