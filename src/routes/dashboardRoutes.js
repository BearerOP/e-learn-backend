const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");
const dashboardController = require("../controllers/dashboardController");

router.use(userAuth);

router.get("/",dashboardController.instructorDashboard);

module.exports = router;
