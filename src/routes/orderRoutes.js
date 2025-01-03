const express = require("express");
const orderRouter = express.Router();

const userAuth = require("../../middleware/userAuth");

const {
    createOrder,
    // getOrderById,
    // getMyOrders,
    // getAllOrders,
    // updateOrder,
    // deleteOrder,
} = require("../controllers/orderController");

orderRouter.post("/create", userAuth, createOrder);

module.exports = orderRouter;