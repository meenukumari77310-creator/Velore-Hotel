import express from "express";
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { forgetPassword } from "../controllers/forgetPassword.js";
import { verifyOtp } from "../controllers/verifyOtp.js";
import { getOtpTime } from "../controllers/getOtpTime.js";
import { updatePassword } from "../controllers/updatePassword.js";
import { getAccess } from "../controllers/getAccess.js";
import { auth } from "../middleware/auth.js";
import { loginViaFirebase } from "../controllers/auth_controller.js";
import { savePasswordMagicLink } from "../controllers/savePasswordMagicLink.js";
import { getUserInfo } from "../controllers/getUserInfo.js";
import { logoutAllDevices } from "../controllers/logoutAllDevices.js";
import {
  menu,
  createDish,
  updateDish,
  deleteDish,
  getDishById,
} from "../Restaurant/menu/menu.js";
import {
  addCart,
  getCart,
  deleteCart,
  clearCart,
} from "../Restaurant/menu/cart.js";
import {
  addFavorite,
  getFavorite,
  deleteFavorite,
  clearFavorite,
} from "../Restaurant/menu/favorite.js";
import { createCheckoutSession } from "../controllers/createCheckoutSession.js";
import {
  contact,
  deleteMessage,
  getAllContactMessages,
  replyToMessage,
} from "../Restaurant/contact/contact.js";
import {
  addReview,
  getAllReviews,
  deleteReview,
  updateReview,
} from "../Restaurant/review.js";
import { getProfile, addOrUpdateProfileImage } from "../Restaurant/profile.js";
import {
  uploadDishImage,
  uploadGalleryImage,
  uploadTeamImage,
  uploadAboutImage,
  uploadBlogImage,
  uploadProfileImage,
  uploadEventImage,
  uploadRoomImage,
} from "../config/Cloudinary.js";
import {
  addImage,
  deleteImage,
  updateImage,
  getImages as adminGetImages,
} from "../admin_controller/image.js";

import { getImages as userGetImages } from "../Restaurant/images.js";
import {
  BookTable,
  getBookingData,
  putBookingData,
  getAvailability,
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
  deleteBooking,
} from "../Restaurant/booking.js";
import {
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
  getCategorySales,
} from "../Restaurant/menu/PaymentController.js";
// Admin routes
import { adminAuth } from "../middleware/adminAuth.js";
import { AdminRegister } from "../admin_controller/adminregister.js";
import { AdminlogoutAllDevices } from "../admin_controller/adminlogoutAllDevices.js";
import { AdminloginViaFirebase } from "../admin_controller/admin_auth_controller.js";
import { AdminforgetPassword } from "../admin_controller/adminforgetPassword.js";
import { AdmingetAccess } from "../admin_controller/admingetAccess.js";
import { AdmingetOtpTime } from "../admin_controller/admingetOtpTime.js";
import { AdmingetUserInfo } from "../admin_controller/admingetUserInfo.js";
import { Adminlogin } from "../admin_controller/adminlogin.js";
import { AdminsavePasswordMagicLink } from "../admin_controller/adminsavePasswordMagicLink.js";
import { AdminupdatePassword } from "../admin_controller/adminupdatePassword.js";
import { AdminverifyOtp } from "../admin_controller/adminverifyOtp.js";
import { getUser, updateUser, deleteUser } from "../Restaurant/userManage.js";
import {
  getAllTeamMembers,
  deleteTeamMember,
  createTeamMember,
  updateTeamMember,
  getTeamMemberById,
} from "../Restaurant/TeamController.js";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Restaurant/menu/category.js";
import {
  getRestaurantDetails,
  updateRestaurantDetails,
  addRestaurantDetails,
} from "../Restaurant/restaurant.js";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../Restaurant/testinomial.js";
import {
  addHowItWorks,
  getHowItWorks,
  updateHowItWorks,
  deleteHowItWorks,
} from "../Restaurant/howItWorks.js";
import {
  addWhyChoose,
  updateWhyChoose,
  getWhyChoose,
  deleteWhyChoose,
} from "../Restaurant/whyChoose.js";
import {
  addMission,
  deleteMission,
  getMission,
  updateMission,
} from "../Restaurant/Mission.js";
import { getIntro, updateIntro } from "../Restaurant/AbouIntro.js";
import {
  getUserEventsByUserId,
  getEventBookingById,
  bookEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getLoyaltyPoints,
  redeemPoints,
  getAllUsersWithPoints,
} from "../Restaurant/eventBooking.js";
import {
  addEventSetting,
  deleteEventSetting,
  getEventSettings,
  updateEventSetting,
} from "../Restaurant/eventSetting.js";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../Restaurant/blogController.js";
import { createEventCheckoutSession } from "../Restaurant/createEventCheckoutSession.js";
import {
  getLoyaltyConfig,
  updateLoyaltyConfig,
} from "../Restaurant/loyaltyConfigController.js";
import {
  addOrUpdateAdminProfileImage,
  getAdminProfile,
} from "../Restaurant/adminProfile.js";
import { addGeneralInfo, deleteGeneralInfo, getAllGeneralInfo, updateGeneralInfo } from "../Restaurant/generalEventInfo.js";
import { addRoom, deleteRoom, getRoomBySlug, getRooms, updateRoom } from "../Restaurant/RoomController.js";
import { addRoomDetail, deleteRoomDetail, getRoomDetailsBySummaryId, removeRoomImage, updateRoomDetail } from "../Restaurant/RoomDetailsController.js";
import { createRoomStripeSession, deleteRoomBooking, getAllRoomBookings, getRoomBookingById, updateRoomBooking } from "../Restaurant/createRoomStripeSession.js";
import { deleteHeroSection, getHeroSection, postHeroSection, updateHeroSection } from "../Restaurant/heroSectionController.js";
import { handleStripeWebhook } from "../Restaurant/stripeWebhookController.js";
import { generateText } from "../Restaurant/huggingFaceController.js";

const router = express.Router();

router.post("/loginviafirebase",  loginViaFirebase);
router.post("/save_password_magic_link", savePasswordMagicLink);
router.post("/register", register);
router.post("/login", login);
router.post("/forget/password", forgetPassword);
router.post("/otp/verify", verifyOtp);
router.post("/otp/time", getOtpTime);
router.post("/password/update", updatePassword);
router.post("/get/access", auth, getAccess);
router.get("/user", auth, getUserInfo);

// USER ROUTES (Require auth, not adminAuth)
router.get("/user/menu", auth, menu);
router.get("/user/menu/:id", auth, getDishById);

// ADMIN ROUTES (With adminAuth and image upload)
router.post(
  "/admin/menu",
  uploadDishImage.single("image"),
  adminAuth,
  createDish
);
router.put(
  "/admin/menu/:id",
  uploadDishImage.single("image"),
  adminAuth,
  updateDish
);
router.delete("/admin/menu/:id", adminAuth, deleteDish);
router.get("/admin/menu", adminAuth, menu);
router.get("/admin/menu/:id", adminAuth, getDishById);

// 👤 USER ROUTE (view only)
router.get("/gallery", auth, userGetImages);

// 🔐 ADMIN ROUTES (manage images)
router.get("/admin/gallery", adminAuth, adminGetImages);
router.post(
  "/admin/gallery",
  adminAuth,
  uploadGalleryImage.single("image"),
  addImage
);
router.delete("/admin/gallery/:id", adminAuth, deleteImage);
router.put("/admin/gallery/:id", adminAuth, updateImage); // optional

//user Routes
router.get("/get/reviews", auth, getAllReviews);
router.post("/add/reviews", auth, addReview);

// ADMIN REVIEW ROUTES
router.get("/admin/reviews", adminAuth, getAllReviews); // Admin: View all reviews
router.delete("/admin/reviews/:id", adminAuth, deleteReview); // Admin: Delete review by ID
router.put("/admin/reviews/:id", adminAuth, updateReview);

// 👤 ADMIN USER MANAGEMENT ROUTES
router.get("/admin/users", adminAuth, getUser); // View all users
router.patch("/admin/users/:id", adminAuth, updateUser); // Ban/Unban user
router.delete("/admin/users/:id", adminAuth, deleteUser); // Delete user

// Admin Team Routes
router.post(
  "/admin/team",
  adminAuth,
  uploadTeamImage.single("image"),
  createTeamMember
);
router.get("/admin/team", adminAuth, getAllTeamMembers);
router.put(
  "/admin/team/:id",
  adminAuth,
  uploadTeamImage.single("image"),
  updateTeamMember
);
router.delete("/admin/team/:id", adminAuth, deleteTeamMember);
router.get("/admin/team/:id", adminAuth, getTeamMemberById);

// Public Team Route
router.get("/team", auth, getAllTeamMembers);
router.get("/team/:id", auth, getTeamMemberById); // Public or user route

// CATEGORY ROUTES
router.get("/user/categories", auth, getCategories); // User: View all categories
router.get("/admin/categories", adminAuth, getCategories); // Admin: View all categories
router.post("/admin/categories", adminAuth, createCategory); // Admin: Create category
router.get("/admin/categories/:id", adminAuth, getCategoryById); // Admin: Get category
router.put("/admin/categories/:id", adminAuth, updateCategory); // Admin: Update category
router.delete("/admin/categories/:id", adminAuth, deleteCategory); // Admin: Delete category

//Restaurant Details Routes
//user
router.get("/user/restaurant", auth, getRestaurantDetails);
//admin
router.post("/admin/restaurant", adminAuth, addRestaurantDetails); // Add new settings (only once)
router.get("/admin/restaurant", adminAuth, getRestaurantDetails); // Get current settings
router.put("/admin/restaurant", adminAuth, updateRestaurantDetails); // Update settings

//Admin testinomial
router.get("/admin/testinomial", adminAuth, getTestimonials);
router.post("/admin/testinomial", adminAuth, addTestimonial);
router.put("/admin/testinomial/:id", adminAuth, updateTestimonial);
router.delete("/admin/testinomial/:id", adminAuth, deleteTestimonial);

//User Testimonial
router.get("/user/testimonial", auth, getTestimonials);

//Admin How it Works
router.post("/admin/howItWorks", adminAuth, addHowItWorks);
router.get("/admin/howItWorks", adminAuth, getHowItWorks);
router.put("/admin/howItWorks/:id", adminAuth, updateHowItWorks);
router.delete("/admin/howItWorks/:id", adminAuth, deleteHowItWorks);

//User How it works
router.get("/user/howItWorks", auth, getHowItWorks);

//Admin Why Choose Foodie
router.get("/admin/whyChoose", adminAuth, getWhyChoose);
router.post("/admin/whyChoose", adminAuth, addWhyChoose);
router.put("/admin/whyChoose/:id", adminAuth, updateWhyChoose);
router.delete("/admin/whyChoose/:id", adminAuth, deleteWhyChoose);

//User Why Choose Foodie
router.get("/user/whyChoose", auth, getWhyChoose);

//Admin Mission
router.post("/admin/mission", adminAuth, addMission);
router.get("/admin/mission", adminAuth, getMission);
router.put("/admin/mission/:id", adminAuth, updateMission);
router.delete("/admin/mission/:id", adminAuth, deleteMission);

//User Mission
router.get("/user/mission", auth, getMission);

//Admin About Intro
router.get("/admin/intro", adminAuth, getIntro);
router.put(
  "/admin/intro",
  uploadAboutImage.single("image"),
  adminAuth,
  updateIntro
);

//User About Intro
router.get("/user/intro", auth, getIntro);

// ✅ Event Catering (User + Admin)
router.post("/event", auth, bookEvent); // User: Book event
router.get("/events", adminAuth, getEvents); // Admin: View all event bookings
router.put("/events/:id", adminAuth, updateEvent); // Admin: Update event booking (approve/reject)
router.delete("/events/:id", adminAuth, deleteEvent);
router.get("/event", auth, getUserEventsByUserId);
router.post("/create-event-checkout-session", auth, createEventCheckoutSession);

router.get("/event-booking/:id", auth, getEventBookingById);

// routes/admin.
router.post("/admin/event-settings", uploadEventImage.single("image"), adminAuth, addEventSetting);
router.get("/admin/event-settings", adminAuth, getEventSettings);
router.put("/admin/event-settings/:id", uploadEventImage.single("image"), adminAuth, updateEventSetting);
router.delete("/admin/event-settings/:id", adminAuth, deleteEventSetting);

router.get("/user/event-setting", auth, getEventSettings);


router.get("/admin/event-info/", adminAuth, getAllGeneralInfo);
router.post("/admin/event-info/", uploadEventImage.single("image"), adminAuth, addGeneralInfo);
router.put("/admin/event-info/:id", uploadEventImage.single("image"), adminAuth, updateGeneralInfo);
router.delete("/admin/event-info/:id", adminAuth, deleteGeneralInfo);

router.get("/user/event-info/", auth, getAllGeneralInfo);

router.get("/loyalty/:userId", auth, getLoyaltyPoints);
router.post("/loyalty/redeem", auth, redeemPoints);
router.get("/admin/points", adminAuth, getAllUsersWithPoints);

router.get("/admin/config", adminAuth, getLoyaltyConfig);
router.put("/admin/config", adminAuth, updateLoyaltyConfig); // secure this route with admin check

router.get("/user/config", auth, getLoyaltyConfig);

//Blog Posts Routes
router.get("/user/blog", auth, getAllPosts);
router.get("/user/blog/:id", auth, getPostById);

// Admin-only routes
router.get("/admin/blog", adminAuth, getAllPosts);
router.post(
  "/admin/blog",
  uploadBlogImage.single("image"),
  adminAuth,
  createPost
);
router.put(
  "/admin/blog/:id",
  adminAuth,
  uploadBlogImage.single("image"),
  updatePost
);
router.delete("/admin/blog/:id", adminAuth, deletePost);

router.get("/notifications", auth, getNotifications);
router.delete("/notifications/:id", auth, deleteNotification);
router.delete("/notifications", auth, deleteAllNotifications);

router.get("/admin/messages", adminAuth, getAllContactMessages); // Admin view
router.post("/admin/messages/:id/reply", adminAuth, replyToMessage); // Admin reply
router.delete("/admin/messages/:id", adminAuth, deleteMessage);

router.get("/order", adminAuth, getAllOrders);
router.get("/order/category-sales", adminAuth, getCategorySales); // <--- here
router.patch("/order/:id", adminAuth, updateOrderStatus);
router.delete("/order/:id", adminAuth, deleteOrder);


router.post("/add/cart", auth, addCart);
router.get("/get/cart", auth, getCart);
router.delete("/delete/cart/:dishId", auth, deleteCart);
router.delete("/clear/cart", auth, clearCart);
router.post("/add/favorite", auth, addFavorite);
router.get("/get/favorite", auth, getFavorite);
router.delete("/delete/favorite/:dishId", auth, deleteFavorite);
router.delete("/clear/favorite", auth, clearFavorite);
router.post("/payment", auth, createCheckoutSession);
router.post("/contact", auth, contact);

router.get("/admin/book-room", adminAuth, getRooms);
router.post("/admin/book-room",adminAuth, uploadRoomImage.single("coverImage"), addRoom);
router.put("/admin/book-room/:id",adminAuth,uploadRoomImage.single("coverImage"),updateRoom);
router.delete("/admin/book-room/:id", adminAuth, deleteRoom);

router.get("/user/book-room/:slug", auth, getRoomBySlug);
router.get("/user/book-room", auth, getRooms);

router.post("/admin/room-detail/:roomSummaryId", adminAuth, uploadRoomImage.array("images"), addRoomDetail);
router.get("/admin/room-detail/:roomSummaryId", adminAuth, getRoomDetailsBySummaryId);
router.put("/admin/room-detail/detail/:detailId", adminAuth, uploadRoomImage.array("images"), updateRoomDetail);
router.delete("/admin/room-detail/detail/:detailId", adminAuth, deleteRoomDetail);


router.put("/remove-image",adminAuth, removeRoomImage);


router.get("/user/hero-section", auth, getHeroSection);
router.get("/hero-section", adminAuth, getHeroSection);

// routes/auth.js

// POST route (must be POST, not GET)
router.post("/cohere",auth, generateText);


// Admin routes to manage hero section
router.post(
  "/admin/hero-section",
  adminAuth,
  uploadAboutImage.array("slides", 10),
  postHeroSection
);
router.put(
  "/admin/hero-section",
  adminAuth,
  uploadAboutImage.array("slides", 10),
  updateHeroSection
);
router.delete("/admin/hero-section", adminAuth, deleteHeroSection);

router.get("/user/room-detail/:roomSummaryId", auth, getRoomDetailsBySummaryId);

router.post("/stripe-session", auth, createRoomStripeSession);

router.get("/admin/room-booking", adminAuth, getAllRoomBookings);
router.get("/admin/room-booking/:id", adminAuth, getRoomBookingById);
router.put("/admin/room-booking/:id", adminAuth, updateRoomBooking);
router.delete("/admin/room-booking/:id", adminAuth, deleteRoomBooking);

router.post(
  "/add/profile",
  auth,
  uploadProfileImage.single("profileImage"),
  addOrUpdateProfileImage
);
router.get("/get/profile", auth, getProfile);

router.post(
  "/admin/add/profile",
  adminAuth,
  uploadProfileImage.single("image"),
  addOrUpdateAdminProfileImage
);
router.get("/admin/get/profile", adminAuth, getAdminProfile);

router.post("/book/table", auth, BookTable);
router.get("/bookings", adminAuth, getBookingData); // Get all bookings
router.put("/bookings/:id", adminAuth, putBookingData); // Update booking
router.delete("/bookings/:id", adminAuth, deleteBooking);
router.get("/availability", auth, getAvailability);

router.post("/logout", auth, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/logout-all", auth, logoutAllDevices);

// Admin Routes
router.post("/admin/loginviafirebase", AdminloginViaFirebase);
router.post("/admin/save_password_magic_link", AdminsavePasswordMagicLink);
router.post("/admin/register", AdminRegister);
router.post("/admin/login", Adminlogin);
router.post("/admin/forget/password", AdminforgetPassword);
router.post("/admin/otp/verify", AdminverifyOtp);
router.post("/admin/otp/time", AdmingetOtpTime);
router.post("/admin/password/update", AdminupdatePassword);
router.post("/admin/get/access", adminAuth, AdmingetAccess);
router.get("/admin/user", adminAuth, AdmingetUserInfo);
router.post("/admin/logout-all", adminAuth, AdminlogoutAllDevices);

router.post("/admin/logout", adminAuth, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Stripe webhook route
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }), // Important: raw body required by Stripe
  handleStripeWebhook
);

export default router;
