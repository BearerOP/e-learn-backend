const { get } = require("mongoose");
const { Course, User, Track, Cart } = require("../models/schema");

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
      path: "tracks",
      model: "Track",
      select: "title description type videoUrl content subTracks",
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

const purchaseCourse = async (items, user) => {
  try {
    // Find the user
    const userCourse = await User.findById(user._id);
    if (!userCourse) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    // Validate courses and check if they can be purchased
    for (const item of items) {
      const courseAlreadyPurchased = userCourse.purchasedCourses.some(
        (courseId) => courseId.toString() === item._id.toString()
      );
      if (courseAlreadyPurchased) {
        return {
          status: 400,
          message: `Course already purchased: ${item.title}`,
          success: false,
        };
      }
      // Add the course to the user's purchased courses
      userCourse.purchasedCourses.push(item._id);
      const course = await Course.findById(item._id);
      course.studentsEnrolled.push(user._id);
      await course.save();
    }

    // Find and update the user's cart
    const userCart = await Cart.findOne({ userId: user._id });
    if (!userCart) {
      return {
        status: 404,
        message: "Cart not found for user",
        success: false,
      };
    }
    // Remove purchased items from the cart
    userCart.cart = userCart.cart.filter(
      (courseId) => !items.some(item => item._id.toString() === courseId.toString())
    );
    await userCourse.save();
    await userCart.save();

    return {
      status: 200,
      message: "Courses purchased successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error in purchaseCourse:", error);
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

const addTrack = async (instructor, courseId, trackData) => {
  try {
    const course = await Course.findOne({
      _id: courseId,
      createdBy: instructor._id,
    });
    if (!course) {
      return {
        status: 404,
        message: "Course not found",
        success: false,
      };
    }

    // Check if a track with the same title and videoUrl already exists in the course
    const existingTrack = await Track.findOne({
      title: trackData.title,
      videoUrl: trackData.videoUrl,
    });
    if (existingTrack) {
      return {
        status: 400,
        message: "Track with the same title and videoUrl already exists",
        success: false,
      };
    }

    const newTrack = {
      title: trackData.title,
      description: trackData.description,
      type: trackData.type,
      videoUrl: trackData.videoUrl,
      content: trackData.content,
      subTracks: trackData.subTracks,
    };
    const session = await Course.startSession();
    session.startTransaction();
    try {
      const track = await Track.create([newTrack], { session });
      course.tracks.push(track[0]._id);
      await course.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return {
      status: 201,
      message: `Track added successfully to the ${course.title} course`,
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

const getCourseContent = async (courseId) => {
  try {
    const course = await Course.findOne({ _id: courseId }).populate({
      path: "tracks",
      model: "Track",
      select: "_id title description type videoUrl content subTracks",
    });
    if (!course) {
      return {
        status: 404,
        message: "Course not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Course content retrieved successfully",
      success: true,
      data: course.tracks,
      courseTitle: course.title,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      success: false,
    };
  }
};

const getTrackContent = async (trackId) => {
  try {
    const track = await Track.findOne({ _id: trackId }).populate({
      path: "subTracks",
      model: "Track",
      select: "_id title description type videoUrl content subTracks",
    });

    if (!track) {
      return {
        status: 404,
        message: "Track not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Track content retrieved successfully",
      success: true,
      data: track.subTracks,
      trackTitle: track.title,
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
  addTrack,
  getCourseContent,
  getTrackContent,
};
