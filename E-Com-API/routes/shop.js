const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
router.get("/products", shopController.getAllProducts); //
router.get("/product-description/", shopController.getProductDescription); //
router.get("/cart", isAuth, shopController.getCart); //
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct); //
router.post("/add-item", isAuth, shopController.addToCart); //
router.post("/create-order", isAuth, shopController.postOrder); //
router.get("/orders", isAuth, shopController.getOrders); //
module.exports = router;
