const { User, Course } = require("../models/schema"); // Adjust the path as necessary

const getInstructorDashboard = async (req, res) => {
  const instructorId = req.user._id;
  try {
    // Get courses count
    const coursesCount = await Course.countDocuments({
      createdBy: instructorId,
    });

    // Get all courses created by the instructor with studentsEnrolled populated
    const instructorCourses = await Course.find({ createdBy: instructorId })
      .select("_id price studentsEnrolled")
      .populate("studentsEnrolled", "_id"); // Populate to ensure we get actual student IDs
    console.log("instcources", instructorCourses);

    // Calculate total unique students and earnings
    const uniqueStudents = new Set();
    let totalEarnings = 0;

    instructorCourses.forEach((course) => {
      // Add each student to the Set (automatically handles duplicates)
      course.studentsEnrolled.forEach((student) => {
        uniqueStudents.add(student._id.toString());
      });

      // Calculate earnings for this course (price × number of students)
      totalEarnings += course.price * course.studentsEnrolled.length;
    });

    const totalStudents = uniqueStudents.size;

    return {
      success: true,
      status: 200,
      message: "Instructor dashboard data fetched successfully",
      coursesCount,
      totalStudents,
      totalEarnings,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: `Failed to fetch instructor dashboard data: ${error.message}`,
    };
  }
};

const getStudentDashboard = async (req, res) => {
  const studentId = req.user._id;
  try {
    // Get enrolled courses count from user's purchasedCourses
    const user = await User.findById(studentId)
      .select("purchasedCourses")
      .populate("purchasedCourses", "price");

    const enrolledCoursesCount = user.purchasedCourses.length;

    // Calculate total spent (sum of all purchased course prices)
    // Note: This assumes the student paid the full price for each course
    // Adjust if your payment logic is different
    const totalSpent = user.purchasedCourses.reduce(
      (sum, course) => sum + course.price,
      0
    );

    return {
      enrolledCoursesCount,
      totalSpent,
    };
  } catch (error) {
    throw new Error(`Failed to fetch student dashboard data: ${error.message}`);
  }
};

module.exports = {
  getInstructorDashboard,
  getStudentDashboard,
};
