const path = require("path");

const express = require("express");
const sellerController = require("../controllers/seller");
const router = express.Router();
router.post("/product_delivery_request", sellerController.productDeliveryReq);
router.post("/add_seller_product", sellerController.addProdSeller);
module.exports = router;
