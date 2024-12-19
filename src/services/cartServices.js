const { User, Course } = require("../models/schema");

const addItem = async (user, body) => {
  try {
    const course = await Course.findById(body.courseId).lean();
    if (!course) {
      return { success: false, message: "Course not found" };
    }
    console.log(user.cart);

    const courseExistsInCart = user.cart.some(
      (item) => item.courseId && item.courseId.equals(body.courseId)
    );
    if (courseExistsInCart) {
      return { success: false, message: "Course already in cart" };
    }
    user.cart.push({ courseId: body.courseId });
    await User.updateOne({ _id: user._id }, { cart: user.cart });
    return { success: true, message: "Course added to cart" };
  } catch (error) {
    console.log(error);

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
          path: "_id",
          select: "title price avgRating createdBy",
        },
      })
      .lean();
      console.log('ch');
      
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
