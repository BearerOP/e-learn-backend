const { getInstructorDashboard } = require("../services/dashboardService");


exports.instructorDashboard = async (req, res) => {
  try {
    const data = await getInstructorDashboard(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};