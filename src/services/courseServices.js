const User = require("../models/userModel");
const Course = require("../models/courseModel");

const addCourse = async (courseData, admin) => {
  try {
    const { name, description, price, category, duration } = courseData;
    const author = admin._id;

    // Check if a course with the same name by the same author already exists
    const existingCourse = await Course.findOne({ name, author });
    if (existingCourse) {
      return {
        status: 400,
        success: false,
        message: "Course with this name already exists",
      };
    }

    // Create new course
    const newCourse = new Course({
      name,
      description,
      price,
      category,
      author,
      duration,
    });
    await newCourse.save();

    await User.findByIdAndUpdate(
      author,
      { $push: { myCourses: newCourse._id } },
      { new: true }
    );

    return { status: 201, message: "Course added successfully", success: true };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const getAllCourses = async () => {
  try {
    // Filter courses where status is 'published'
    const courses = await Course.find({ status: "published" }).populate(
      "author",
      "username email"
    );

    return { status: 200, success: true, data: courses };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const getCourseById = async (courseId) => {
  try {
    // Find course by id and populate author
    const course = await Course.findOne({
      _id: courseId,
      status: "published",
    }).populate("author", "username email");
    if (!course) {
      return {
        status: 404,
        success: false,
        message: "Course not found",
      };
    }
    return { status: 200, success: true, data: course };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const editCourse = async (courseId, courseData, admin) => {
  try {
    // Find course by id
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return {
        status: 404,
        success: false,
        message: "Course not found",
      };
    }
    // Check if the admin is the author of the course
    const isAuthor = course.author.equals(admin._id); // Assuming admin has an _id property

    if (!isAuthor) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to edit this course",
      };
    }

    // Update course
    const updatedCourse = await Course.updateOne(
      { _id: courseId },
      { $set: courseData }
    );
    if (!updatedCourse) {
      return {
        status: 500,
        success: false,
        message: "Failed to update course",
      };
    }
    return {
      status: 200,
      success: true,
      message: "Course updated successfully",
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const deleteCourse = async (courseId, admin) => {
  try {
    // Find course by id
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return {
        status: 404,
        success: false,
        message: "Course not found",
      };
    }

    // Check if the admin is the author of the course
    const isAuthor = course.author.equals(admin._id); // Assuming admin has an _id property
    if (!isAuthor) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to delete this course",
      };
    }

    // Remove course from the author's myCourses array
    await User.updateOne(
      { _id: course.author },
      { $pull: { myCourses: courseId } }
    );

    // Delete course
    const deletedCourse = await Course.deleteOne({ _id: courseId });
    if (!deletedCourse) {
      return {
        status: 500,
        success: false,
        message: "Failed to delete course",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const getMyCourses = async (admin) => {
  try {
    const user = await User.findOne({ _id: admin._id }).populate({
      path: 'myCourses',

    });

    if (!user || !user.myCourses.length) {
      return {
        status: 404,
        success: false,
        message: "No courses found",
      };
    }

    return {
      status: 200,
      success: true,
      data: user.myCourses,
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};


module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  editCourse,
  deleteCourse,
  getMyCourses,
};
