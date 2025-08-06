const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // Import the new controller function
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

router.delete("/delete/:id", deleteFeatureImage); // New DELETE route

module.exports = router;
