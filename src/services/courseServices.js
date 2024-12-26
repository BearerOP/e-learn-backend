const { Course, User } = require("../models/schema");

const addCourse = async (courseData, instructor) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subCategory,
      thumbnail,
      tags,
    } = courseData;
    const createdBy = instructor._id;
    // Check if a course with the same name by the same author already exists
    const existingCourse = await Course.findOne({ title, createdBy });
    if (existingCourse) {
      return {
        status: 400,
        success: false,
        message: "Course with this name already exists",
      };
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      price,
      category,
      subCategory,
      tags,
      thumbnail,
      createdBy,
    });
    await newCourse.save();

    return { status: 201, message: "Course added successfully", success: true };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};
const getAllCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Fetch only published courses with pagination
    const courses = await Course.find({ status: "published" })
      .populate("createdBy", "username email")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCourses = await Course.countDocuments({ status: "published" });

    return {
      status: 200,
      success: true,
      data: courses,
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
    };
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
    console.log(courseId);

    const course = await Course.findOne({
      _id: courseId,
    });
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

const editCourse = async (courseId, courseData, instructor) => {
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
    // Check if the instructor is the author of the course
    const isAuthor = course.author.equals(instructor._id); // Assuming instructor has an _id property

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
    console.log(updatedCourse);

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

const deleteCourse = async (courseId, instructor) => {
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

    // Check if the instructor is the author of the course
    const isAuthor = course.author.equals(instructor._id); // Assuming instructor has an _id property
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

const publishedCourses = async (instructor) => {
  try {
    // Find all courses created by the instructor
    const courses = await Course.find({ createdBy: instructor._id }).populate({
      path: 'tracks',
      model: 'Track',
      select: 'title description type videoUrl content subTracks',
    });

    if (!courses || !courses.length) {
      return {
        status: 404,
        success: false,
        message: "No course uploaded yet!",
      };
    }
    return {
      status: 200,
      success: true,
      data: courses,
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
};

const draftedCourses = async (instructor) => {
  try {
    // Find the user by their ID and populate the myCourses field with only the published courses
    const user = await User.findOne({ _id: instructor._id }).populate({
      path: "myCourses", // Assuming myCourses contains course IDs
      match: { status: "draft" }, // Only populate courses with the 'draft' status
      select: "name category status", // Specify the fields to populate
    });

    if (!user || !user.myCourses.length) {
      return {
        status: 404,
        success: false,
        message: "No drafted courses found",
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

const purchaseCourse = async (courseId, user) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return {
        status: 404,
        message: "Course not found",
        success: false,
      };
    }
    console.log(course);

    // Check if the course is published
    if (course.status !== "published") {
      return {
        status: 400,
        message: "Cannot purchase an unpublished course",
        success: false,
      };
    }

    const userCourse = await User.findOne({ _id: user._id });
    if (!userCourse) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    const courseInUserCourses = userCourse.purchasedCourses.find(
      (courseId) => courseId.toString() === course._id.toString()
    );
    if (courseInUserCourses) {
      return {
        status: 400,
        message: "Course already purchased",
        success: false,
      };
    }

    // Optionally, check if the user has sufficient funds
    // if (user.balance < course.price) {
    //   return {
    //     status: 400,
    //     message: "Insufficient funds",
    //     success: false,
    //   };
    // }

    userCourse.purchasedCourses.push(course._id);
    const savedCourse = await userCourse.save();
    console.log(userCourse);

    return {
      status: 200,
      message: "Course purchased successfully",
      success: true,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      success: false,
    };
  }
};

const getMyPurchasedCourses = async (user) => {
  try {
    // Find the user by their ID
    const userCourse = await User.findOne({ _id: user._id });
    if (!userCourse) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    // Get the array of purchased course ObjectIds
    const purchasedCourseIds = userCourse.purchasedCourses;

    // Fetch course details for each course ID in the purchasedCourses array
    const purchasedCourses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    return {
      status: 200,
      message: "Courses retrieved successfully",
      success: true,
      data: purchasedCourses, // Full course details
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      success: false,
    };
  }
};

const getMyCourses = async (user) => {
  try {
    // Find the user by their ID
    const userCourses = await User.findOne({ _id: user._id })
      .select("purchasedCourses wishlist archivedCourses")
      .populate([
        { path: "purchasedCourses", model: "Course" },
        { path: "wishlist", model: "Course" },
        { path: "archivedCourses", model: "Course" },
      ]);

    if (!userCourses) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Courses retrieved successfully",
      success: true,
      data: userCourses,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      success: false,
    };
  }
};

const courseByCategory = async (query) => {
  try {
    let courses;
    if (query == "all") {
      courses = await Course.find({ status: "published" }).populate(
        "createdBy",
        "username email"
      );
    } else {
      courses = await Course.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { subCategory: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
        status: "published",
      }).populate("createdBy", "username email");
    }
    return {
      status: 200,
      message: "Search results retrieved successfully",
      success: true,
      data: courses,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      success: false,
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
  purchaseCourse,
  getMyPurchasedCourses,
  publishedCourses,
  draftedCourses,
  courseByCategory,
};
