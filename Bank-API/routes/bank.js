const path = require('path');

const express = require('express');

const bankController = require('../controllers/bank');
const router = express.Router();
router.post('/transaction_req', bankController.transactionOrder);
router.post('/check_user_balance', bankController.checkBalanceUser);
router.post('/add_bank_user', bankController.addBankUser);
router.post('/order_id', bankController.orderId);
router.post("/transaction_confirmation", bankController.transactionConfirm);

module.exports = router;
