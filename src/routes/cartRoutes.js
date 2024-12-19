const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");

const {
  addItemController,
  removeItemController,
  getCartController,
} = require("../controllers/cartController");

router.post("/add", userAuth, addItemController);
router.post("/remove", userAuth, removeItemController);
router.get("/", userAuth, getCartController);


module.exports = router;
