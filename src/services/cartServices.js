const { User, Course } = require("../models/schema");


const mongoose = require('mongoose');

const addItem = async (user, body) => {
    try {
      // Validate the courseId
      if (!mongoose.Types.ObjectId.isValid(body.courseId)) {
        return { success: false, message: "Invalid course ID" };
      }
      const courseId = new mongoose.Types.ObjectId(body.courseId);
  
      // Check if the course exists
      const course = await Course.findById(courseId).lean();
      if (!course) {
        return { success: false, message: "Course not found" };
      }
  
      // Check if the course is already in the cart
      const courseExistsInCart = user.cart.some(

        (item) => {
            item.equals(courseId)}
      );
      if (courseExistsInCart) {
        return { success: false, message: "Course already in cart" };
      }
  
    user.cart.push(courseId );
    await User.updateOne({ _id: user._id }, { cart: user.cart });
    
    // await user.save();
  
      return { success: true, message: "Course added to cart" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to add course" };
    }
  };
  


const removeItem = async (user, body) => {
  try {
    const user = await User.findById(user._id).select("cart").lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const courseExistsInCart = user.cart.some(
      (item) => item.courseId.toString() === body.courseId
    );
    if (!courseExistsInCart) {
      return { success: false, message: "Course not in cart" };
    }
    user.cart = user.cart.filter(
      (item) => item.courseId.toString() !== body.courseId
    );
    await User.updateOne({ _id: user._id }, { cart: user.cart });
    return { success: true, message: "Course removed from cart" };
  } catch (error) {
    return { success: false, message: "Failed to remove course" };
  }
};

const getCart = async (user) => {
  try {
    const cart = await User.findById(user._id)
      .select("cart")
      .populate({
        path: "cart",
        populate: {
          path: "createdBy",
          select: "username",
        }
      })
      .lean();
    return {
      success: true,
      message: "Cart fetched successfully",
      cart: cart.cart,
    };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Failed to get cart" };
  }
};

module.exports = {
  addItem,
  removeItem,
  getCart,
};
