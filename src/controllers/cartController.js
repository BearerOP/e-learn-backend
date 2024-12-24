const { addItem, removeItem, getCart } = require("../services/cartServices");

exports.addItemController = async (req, res) => {
  try {
    const data = await addItem(req.user, req.body);
    res.status(data.success ? 201 : 400).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to add course" });
  }
};

exports.removeItemController = async (req, res) => {
  try {
    const data = await removeItem(req.user, req.body);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    
    res.status(500).json({ message: "Failed to remove course" });
  }
};

exports.getCartController = async (req, res) => {
  try {
    const data = await getCart(req.user);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get cart" });
  }
};
