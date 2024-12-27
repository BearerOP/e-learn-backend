const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");

const {
  addCourse,
  getAllCourses,
  getCourseById,
  editCourse,
  deleteCourse,
  getMyCourses,
  purchaseCourse,
  getMyPurchasedCourses,
  publishedCourses,
  draftedCourses,
  getCourseByCategory,
  addTrack,
} = require("../controllers/courseController");

router.post("/add", userAuth, addCourse); // Add course
router.get("/getAll", getAllCourses); // Get all courses
router.get("/get", getCourseById); // Get course by id (fixing param)
router.put("/edit/:id", userAuth, editCourse); // Update course by id (changed to PUT and added id param)
router.delete("/delete/:id", userAuth, deleteCourse); // Delete course by id (changed to DELETE and added id param)
router.get("/my", userAuth, getMyCourses); // Get my courses
router.get("/instructor", userAuth, publishedCourses);
router.get("/drafted", userAuth, draftedCourses);
router.get("/purchased", userAuth, getMyPurchasedCourses);
router.post("/purchase/:id", userAuth, purchaseCourse); // Purchase course by id (added id param)
router.get("/category", getCourseByCategory); // Get course by id (added id param)
router.post("/add/track", userAuth, addTrack); // Add track to course (added id param)

module.exports = router;
