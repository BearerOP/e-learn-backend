const { User } = require("../models/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const loginOrRegister = async (req, res) => {
//   try {
//     const { username, email, password, avatar, provider, providerId, role } =
//       req.body;

//     // Check if the user already exists
//     let existingUser = await User.findOne({ email }).lean();

//     if (existingUser) {
//       // User exists, proceed with login flow
//       // Generate a JWT token

//       const isPasswordValid = await bcrypt.compare(
//         password,
//         existingUser.password
//       );

//       if (!isPasswordValid) {
//         return {
//           success: false,
//           message: "Invalid email or password",
//           status: 401,
//         };
//       }

//       const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
//       if (!token) {
//         return {
//           success: false,
//           message: "Token generation failed",
//           status: 500,
//         };
//       }

//       // Update user's accessToken with the token
//       const updatedUser = await User.findOneAndUpdate(
//         { _id: existingUser._id },
//         { accessToken: token },
//         { new: true }
//       );

//       // Set the token in a cookie
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 60 * 60 * 1000, // 1 hour expiration
//       });

//       return {
//         success: true,
//         message: "User logged in successfully",
//         token,
//         role: updatedUser.role,
//         status: 200,
//         user: {
//           username: updatedUser.username,
//           email: updatedUser.email,
//           avatar: updatedUser.avatar,
//           role: updatedUser.role,
//           token: token,
//         },
//       };
//     } else {
//       // User does not exist, proceed with registration flow

//       // Create a new user
//       const newUser = new User({
//         username,
//         email,
//         avatar,
//         provider,
//         providerId,
//         role: role || "user", // Default role if not provided
//       });

//       await newUser.save();

//       // Generate a JWT token for the newly registered user
//       const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);

//       // Set the token in a cookie
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 60 * 60 * 1000,
//       });

//       // Store token in the new user's accessToken
//       await User.findOneAndUpdate(
//         { _id: newUser._id },
//         { accessToken: token },
//         { new: true }
//       );

//       return {
//         success: true,
//         message: "User registered successfully",
//         token,
//         role: newUser.role,
//         status: 201,
//         user: {
//           username: newUser.username,
//           email: newUser.email,
//           avatar: newUser.avatar,
//           role: newUser.role,
//           token: token,
//         },
//       };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message || "Internal server error",
//       status: 500,
//     };
//   }
// };

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
        status: 400,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return {
        success: false,
        message: "Password hashing failed",
        status: 500,
      };
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return {
        success: false,
        message: "User registration failed",
        status: 500,
      };
    }

    return {
      message: "User registered successfully",
      success: true,
      status: 201,
    };
  } catch (error) {
    return {
      message: error.message || "Internal server error",
      success: false,
      status: 500,
    };
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email:email });
    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or not registered!",
        status: 401,
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return {
        status: 401,
        success: false,
        message: "Invalid email or password",
      };
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);

    if (!token) {
      return {
        success: "false",
        message: " Token generation failed",
        status: 500,
      };
    }

    const accessTokenInsertion = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { accessToken: token },
      { new: true }
    );

    if (!accessTokenInsertion) {
      return { message: "Token updation failed", success: false, status: 500 };
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return {
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        avatar: existingUser.avatar,
        role: existingUser.role,
        token: token,
      },
      status: 200,
    };
  } catch (error) {
    return {
      message: error.message || "Internal server error",
      success: false,
      status: 500,
    };
  }
};

const logout = async (req, res) => {
  try {
    const { authToken } = req.body;
    if (!authToken) {
      return { success: false, message: "authToken is required", status: 400 };
    }
    const user = await User.findOne({ accessToken: authToken });

    if (!user) {
      return { success: false, message: "Invalid token", status: 401 };
    }
    const updatedUser = await User.findOneAndUpdate(
      { accessToken: authToken },
      { accessToken: "" },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: "Failed to logout", status: 500 };
    }

    return { success: true, message: "Logged out successfully", status: 200 };
  } catch (error) {
    return { success: false, message: error.message, status: 500 };
  }
};

const profile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return { success: false, message: "Invalid token", status: 400 };
    }

    // Fetch the user along with populated courses for both myCourses and purchasedCourses
    const userWithCourses = await User.findById(user._id)
      .populate("myCourses", "name category price status") // Populate myCourses with selected fields
      .populate("purchasedCourses", "name category price"); // Populate purchasedCourses with only name

    if (!userWithCourses) {
      return { success: false, message: "User not found", status: 400 };
    }

    const myCoursesDetails = userWithCourses.myCourses.map((course) => ({
      name: course.name,
      category: course.category,
      price: course.price,
      status: course.status,
    }));

    const purchasedCoursesDetails = userWithCourses.purchasedCourses.map(
      (course) => ({
        name: course.name,
        category: course.category,
        price: course.price,
      })
    );

    // Return user data along with course names
    return {
      success: true,
      user: {
        ...userWithCourses.toObject(), // Convert user document to plain object
        myCourses: myCoursesDetails,
        purchasedCourses: purchasedCoursesDetails,
      },
      status: 400,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message, status: 500 };
  }
};

module.exports = {
  login,
  register,
  // loginOrRegister,
  logout,
  profile,
};
