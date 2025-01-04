const { User, Course, Cart } = require("../models/schema");

const addItem = async (user, body) => {
  try {
    const { courseId } = body;

    // Check if the user has already purchased the course
    const userDoc = await User.findById(user._id).populate('purchasedCourses');
    const coursePurchased = userDoc.purchasedCourses.some(
      (course) => course._id.toString() === courseId
    );

    if (coursePurchased) {
      return { success: false, message: "Course already purchased", status: 400 };
    }

    const cartDoc = await Cart.findOne({ userId: user._id });

    if (!cartDoc) {
      const newCart = new Cart({
        userId: user._id,
        cart: [courseId],
      });
      await newCart.save();
      return { success: true, message: "Course added to cart", status: 201 };
    }

    const courseExistsInCart = cartDoc.cart.some(
      (item) => item.toString() === courseId
    );

    if (courseExistsInCart) {
      return { success: false, message: "Course is already added to cart", status: 400 };
    }
    cartDoc.cart.push(courseId);
    await cartDoc.save();
    return { success: true, status: 200, message: "Course added to cart" };
  } catch (error) {
    console.log(error);

    return { success: false, status: 500, message: "Failed to add course" };
  }
};

const removeItem = async (user, body) => {
  try {
    const { courseId } = body;
    const cartDoc = await Cart.findOne({ userId: user._id });

    if (!cartDoc) {
      return { success: false, message: "Cart not found", status: 404 };
    }

    const courseExistsInCart = cartDoc.cart.some(
      (item) => item.toString() === courseId
    );

    if (!courseExistsInCart) {
      return { success: false, message: "Course not found in cart", status: 404 };
    }

    cartDoc.cart = cartDoc.cart.filter((item) => item.toString() !== courseId);
    await cartDoc.save();
    return { success: true, message: "Course removed from cart", status: 200 };
  } catch (error) {
    return { success: false, message: "Failed to remove course", status: 500 };
  }
};

const getCart = async (user) => {
  try {
    const cartDoc = await Cart.findOne({ userId: user._id }).populate({
      path: "cart",
      select: "title description category subCategory tags thumbnail price averageRating createdBy",
      populate: {
      path: "createdBy",
      model: "User",
      select: "username email",
      }
    });

    if (!cartDoc) {
      return { success: false, message: "Cart not found", status: 404 };
    }

    return { success: true, cart: cartDoc.cart, status: 200 };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Failed to get cart", status: 500 };
  }
};

module.exports = {
  addItem,
  removeItem,
  getCart,
};
