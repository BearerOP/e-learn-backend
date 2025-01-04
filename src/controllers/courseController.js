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
  courseByCategory,
  addTrack,
  getCourseContent,
  getTrackContent
} = require("../services/courseServices");

exports.addCourse = async (req, res) => {
  try {
    const data = await addCourse(req.body, req.user);
    res.status(data.success ? 201 : 400).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to add course" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const data = await getAllCourses(req,res);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all courses" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const data = await getCourseById(req.query.courseId);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get course by id" });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const data = await editCourse(req.params.id, req.body, req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit course" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const data = await deleteCourse(req.params.id,req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

exports.purchaseCourse = async (req, res) => {
  try {
    const data = await purchaseCourse(req.body.items, req.user); // Pass req.user instead of req.body
    res.status(data.success ? 200 : 400).json(data); // Changed to 400
  } catch (error) {
    res.status(500).json({ message: "Failed to purchase course" });
  }
};

exports.getMyPurchasedCourses = async (req, res) => {
  try {
    const data = await getMyPurchasedCourses(req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get my purchased courses" });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const data = await getMyCourses(req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get my courses" });
  }
};

exports.publishedCourses = async (req, res) => {
  try {
    const data = await publishedCourses(req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get my courses" });
  }
};

exports.draftedCourses = async (req, res) => {
  try {
    const data = await draftedCourses(req.user);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get my courses" });
  }
};

exports.getCourseByCategory = async (req, res) => {
  try {
    const data = await courseByCategory(req.query.category);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get courses by category" });
  }
};
exports.addTrack = async (req, res) => {
  try {
    const data = await addTrack(req.user,req.body.courseId,req.body.trackData);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to add track in the course" });
  }
};

exports.getCourseContent = async (req, res) => {
  try {
    const data = await getCourseContent(req.query.courseId);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get course content" });
  }
};

exports.getTrackContent = async (req, res) => {
  try {
    const data = await getTrackContent(req.query.trackId);
    res.status(data.success ? 200 : 404).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to get track content" });
  }
}
