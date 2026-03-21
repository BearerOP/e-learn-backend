const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");
const instructorAuth = require("../../middleware/instructorAuth");

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
  getCourseContent,
  getTrackContent,
  updateCourseStatus
} = require("../controllers/courseController");

router.post("/add", userAuth, instructorAuth, addCourse); // Add course
router.get("/getAll", getAllCourses); // Get all courses
router.get("/get", getCourseById); // Get course by id (fixing param)
router.put("/edit/:id", userAuth, instructorAuth, editCourse); // Update course by id
router.delete("/delete/:id", userAuth, instructorAuth, deleteCourse); // Delete course by id
router.get("/my", userAuth, getMyCourses); // Get my courses
router.get("/instructor", userAuth, instructorAuth, publishedCourses);
router.get("/drafted", userAuth, instructorAuth, draftedCourses);
router.get("/purchased", userAuth, getMyPurchasedCourses);
router.post("/purchase", userAuth, purchaseCourse); // Purchase course by id (added id param)
router.get("/category", getCourseByCategory); // Get course by id (added id param)
router.post("/add/track", userAuth, instructorAuth, addTrack); // Add track to course
router.get("/content", userAuth, getCourseContent);
router.get("/content/track", userAuth, getTrackContent);
router.put("/status", userAuth, instructorAuth, updateCourseStatus); // Update course status

module.exports = router;
