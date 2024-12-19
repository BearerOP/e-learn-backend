require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/schema");

// Middleware for handling auth
async function userAuth(req, res, next) {
  try {
    console.log("Reached User Auth");
    const tokenHead = req.headers["authorization"];
    console.log(tokenHead);

    if (!tokenHead) {
      return {
        message: "User not logged in.",
        success: "false",
        status: 401,
      };
    }

    const token = tokenHead.split(" ")[1];
    if (!token) {
      return {
        message: "User is not logged in",
        success: "false",
        status: 401,
      };
    }

    const jwtPassword = process.env.SECRET_KEY;
    const decode = await jwt.verify(token, jwtPassword);
    let user = await User.findOne({ _id: decode.id })
      .select("-password -accessToken")
      .exec();

    if (!user)
      return {
        message: "User not found",
        success: "false",
        status: 403,
      };
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return {
      message: error.message || "Internal server error",
      success: false,
      status: 500,
    };
  }
}

module.exports = userAuth;
