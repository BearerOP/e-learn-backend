/**
 * Restricts access to instructor-only routes.
 * Must be used after userAuth. Requires user.role === "both" (teacher).
 */
function instructorAuth(req, res, next) {
  if (req.user?.role !== "both") {
    return res.status(403).json({
      success: false,
      message: "Instructor access required. This feature is only available for teachers.",
    });
  }
  next();
}

module.exports = instructorAuth;
