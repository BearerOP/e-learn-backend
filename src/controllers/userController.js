const {
  register,
  login, 
  logout,
  profile,
  // loginOrRegister,
} = require('../services/userServices');

exports.register = async (req, res) => {
  try {
    const data = await register(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const response = await login(req,res);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const data = await logout(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const data = await profile(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
