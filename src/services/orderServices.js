const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");  // Importing uuid for unique ID generation

const createOrder = async (body, user) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount, currency } = body;

  try {
    const options = {
      amount: amount * 100, // Razorpay requires amount in paise
      currency: currency || "INR",
      receipt: `rcpt_${uuidv4().slice(0, 30)}`, // Using uuid for unique receipt ID and slicing to keep it under 40 chars
      notes: {
        user_id: user ? user._id : "guest", // Example of associating user ID with the order
      },
    };
    const order = await razorpay.orders.create(options);
    return {
      status: 200,
      success: true,
      data: order,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      success: false,
      message: "Failed to create order",
    };
  }
};

module.exports = {
  createOrder,
};
