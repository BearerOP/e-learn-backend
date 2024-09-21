const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
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

    const authKeyInsertion = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { authKey: token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return { message: "Token updation failed", success: false, status: 500 };
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    return {
      message: "User logged in successfully",
      success: true,
      token,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
      status: 500,
    };
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return { success: false, message: "User already exists", status: 400 };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return {
      success: true,
      message: "User registered successfully",
      status: 201,
    };
  } catch (error) {
    return { success: false, message: error.message, status: 500 };
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    
    const user = await User.findOne({ authKey: token });
    if (!user) {
      return { success: false, message: "Invalid token", status: 401 };
    }
    await User.findOneAndUpdate({ authKey },{authKey:'' });
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
    return { success: true, user, status: 200 };
  } catch (error) {
    return { success: false, message: error.message, status: 500 };
  }
};

module.exports = {
  login,
  register,
  logout,
  profile,
};
