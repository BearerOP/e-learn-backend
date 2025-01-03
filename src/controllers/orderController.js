const {
    createOrder,
} = 
require("../services/orderServices.js");

exports.createOrder = async (req, res) => {
    try {
      const data = await createOrder(req.body, req.user);
      console.log(data);
      
      res.status(data.success ? 201 : 400).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add course" });
    }
  };
  