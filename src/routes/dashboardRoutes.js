const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");
const instructorAuth = require("../../middleware/instructorAuth");
const dashboardController = require("../controllers/dashboardController");

router.use(userAuth);
router.use(instructorAuth);

router.get("/", dashboardController.instructorDashboard);

module.exports = router;
