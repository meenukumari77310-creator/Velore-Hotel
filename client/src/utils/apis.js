export const apis = () => {
  const local = "http://localhost:5000/";
  const production = "https://velore-hotel.onrender.com/";

  const base = import.meta.env.MODE === "development" ? local : production;
  const prefix = `${base}foodie`;


  const list = {
    // ✅ User Auth
    registerUser: `${prefix}/register`,
    loginUser: `${prefix}/login`,
    forgetPassword: `${prefix}/forget/password`,
    otpVerify: `${prefix}/otp/verify`,
    getOtpTime: `${prefix}/otp/time`,
    updatePassword: `${prefix}/password/update`,
    getAccess: `${prefix}/get/access`,
    loginviaFirebase: `${prefix}/loginviafirebase`,
    savePasswordMagicLink: `${prefix}/save_password_magic_link`,
    user: `${prefix}/user`,
    logoutAllDevices: `${prefix}/logout-all`,

    // ✅ User Menu (view only)
    userMenu: `${prefix}/user/menu`,
    userMenuById: (id) => `${prefix}/user/menu/${id}`,

    // ✅ Admin Menu (create/update/delete)
    adminMenu: `${prefix}/admin/menu`,
    createMenu: `${prefix}/admin/menu`, // POST
    updateMenu: (id) => `${prefix}/admin/menu/${id}`, // PUT
    deleteMenu: (id) => `${prefix}/admin/menu/${id}`, // DELETE
    adminMenuById: (id) => `${prefix}/admin/menu/${id}`,

    // ✅ Admin Gallery
    adminAddImage: `${prefix}/admin/gallery`, // POST
    adminGetImages: `${prefix}/admin/gallery`, // GET
    adminDeleteImage: (id) => `${prefix}/admin/gallery/${id}`, // DELETE
    adminUpdateImage: (id) => `${prefix}/admin/gallery/${id}`, // PUT

    //user gallery
    galleryUser: `${prefix}/gallery`,

    adminMessages: `${prefix}/admin/messages`,
    adminReplyMessage: `${prefix}/admin/messages`,
    deleteMessage: `${prefix}/admin/messages`,

    // ✅ Admin User Management
    adminGetUsers: `${prefix}/admin/users`,
    adminToggleUserBan: (id) => `${prefix}/admin/users/${id}`,
    adminDeleteUser: (id) => `${prefix}/admin/users/${id}`,

    // ✅ Cart
    addCart: `${prefix}/add/cart`,
    getCart: `${prefix}/get/cart`,
    deleteCart: (dishId) => `${prefix}/delete/cart/${dishId}`,
    clearCart: `${prefix}/clear/cart`,

    // ✅ Favorites
    addFavorite: `${prefix}/add/favorite`,
    getFavorite: `${prefix}/get/favorite`,
    deleteFavorite: (dishId) => `${prefix}/delete/favorite/${dishId}`,
    clearFavorite: `${prefix}/clear/favorite`,

    // ✅ Orders / Payment
    checkoutSession: `${prefix}/payment`,
    order: `${prefix}/order`,

    // ✅ Restaurant
    Contact: `${prefix}/contact`,

    transactions: `${prefix}/transaction`,

    //Admin restaurant details
    addRestaurantDetails: `${prefix}/admin/restaurant`, // POST
    getRestaurantDetails: `${prefix}/admin/restaurant`,
    updateRestaurantDetails: `${prefix}/admin/restaurant`,
    //user restaurant details
    usergetRestaurantDetails: `${prefix}/user/restaurant`,

    //Admin Testinomial
    adminTestimonials: `${prefix}/admin/testinomial`,

    //user Testimonial
    userTestimonials: `${prefix}/user/testimonial`,

    //Admin How it works
    adminHowItWorks: `${prefix}/admin/howItWorks`,

    //User How It Works
    userHowItWorks: `${prefix}/user/howItWorks`,

    //Admin Why Choose
    adminWhyChoose: `${prefix}/admin/whyChoose`,

    //user why choose
    userWhyChoose: `${prefix}/user/whyChoose`,

    //Admin Mission
    adminMission: `${prefix}/admin/mission`,

    //User Mission
    userMission: `${prefix}/user/mission`,

    //Admin  about Intro
    adminIntro: `${prefix}/admin/intro`,

    //Usre about Intro
    userIntro: `${prefix}/user/intro`,

    // ✅ Reviews
    addReview: `${prefix}/add/reviews`,
    getReview: `${prefix}/get/reviews`,

    // ✅ Admin Reviews
    adminGetAllReviews: `${prefix}/admin/reviews`, // GET all reviews
    adminDeleteReview: (id) => `${prefix}/admin/reviews/${id}`, // DELETE a review by ID
    adminUpdateReview: (id) => `${prefix}/admin/reviews/${id}`,

    //user team
    Team: `${prefix}/team`,
    TeamMember: (id) => `${prefix}/team/${id}`,

    //admin team
    adminTeam: `${prefix}/admin/team`,
    adminCreateTeam: `${prefix}/admin/team`, // POST
    adminUpdateTeam: (id) => `${prefix}/admin/team/${id}`, // PUT
    adminDeleteTeam: (id) => `${prefix}/admin/team/${id}`, //
    adminGetTeamById: (id) => `${prefix}/admin/team/${id}`,

    // ✅ Category APIs
    userGetCategories: `${prefix}/user/categories`, // GET (User)
    adminGetCategories: `${prefix}/admin/categories`, // GET (Admin)
    adminCreateCategory: `${prefix}/admin/categories`, // POST
    adminGetCategoryById: (id) => `${prefix}/admin/categories/${id}`, // GET
    adminUpdateCategory: (id) => `${prefix}/admin/categories/${id}`, // PUT
    adminDeleteCategory: (id) => `${prefix}/admin/categories/${id}`, // DELETE

    // (Optional) You could alias userGetCategories as getCategories if needed:
    getCategories: `${prefix}/user/categories`,

    // ✅ Event Catering APIs
    eventBooking: `${prefix}/event`, // POST - User books an event
    adminGetEvents: `${prefix}/events`, // GET - Admin gets all events
    adminUpdateEvent: (id) => `${prefix}/events/${id}`, // PUT - Admin updates event
    adminDeleteEvent: (id) => `${prefix}/events/${id}`,
    getUserEvents: `${prefix}/event`,
    createEventCheckoutSession: `${prefix}/create-event-checkout-session`,

    getEventById: `${prefix}/event-booking`,

    adminAddEventSetting: () => `${prefix}/admin/event-settings`,
    adminGetEventSettings: () => `${prefix}/admin/event-settings`,
    adminUpdateEventSetting: (id) => `${prefix}/admin/event-settings/${id}`,
    adminDeleteEventSetting: (id) => `${prefix}/admin/event-settings/${id}`,

    userGetEventSetting: `${prefix}/user/event-setting`,

    getRoom: `${prefix}/admin/book-room`,
    addRoom: `${prefix}/admin/book-room`,
    putRoom: `${prefix}/admin/book-room`,
    deleteRoom: `${prefix}/admin/book-room`,

    usergetRoom: `${prefix}/user/book-room`,
    usergetRoomById: `${prefix}/user/book-room`,

    getRoomDetail: (summaryId) => `${prefix}/admin/room-detail/${summaryId}`,
    addRoomDetail: (summaryId) => `${prefix}/admin/room-detail/${summaryId}`,
    updateRoomDetail: (detailId) =>
      `${prefix}/admin/room-detail/detail/${detailId}`,
    deleteRoomDetail: (detailId) =>
      `${prefix}/admin/room-detail/detail/${detailId}`,

    usergetRoomDetail: (summaryId) => `${prefix}/user/room-detail/${summaryId}`,

    removeRoomImage: `${prefix}/remove-image`,

    createStripeSession: `${prefix}/stripe-session`,

    getAllRoomBookings: `${prefix}/admin/room-booking`,
    getRoomBookingById: (id) => `${prefix}/admin/room-booking/${id}`,
    updateRoomBooking: (id) => `${prefix}/admin/room-booking/${id}`,
    deleteRoomBooking: (id) => `${prefix}/admin/room-booking/${id}`,

    getHeroSection: `${prefix}/hero-section`,
    addHeroSection:`${prefix}/admin/hero-section`,
    updateHeroSection:`${prefix}/admin/hero-section`,
    deleteHeroSection:`${prefix}/admin/hero-section`,

    usergetHeroSection: `${prefix}/user/hero-section`,

    // New dynamic general info endpoints
    userGetEventInfo: `${prefix}/user/event-info`, // GET all general info sections
    adminGetEventInfo: `${prefix}/admin/event-info`, // GET all sections (admin)
    adminAddEventInfo: `${prefix}/admin/event-info`, // POST new section
    adminUpdateEventInfo: (id) => `${prefix}/admin/event-info/${id}`, // PUT update section
    adminDeleteEventInfo: (id) => `${prefix}/admin/event-info/${id}`, // DELETE section


    loyaltyPoints: (userId) => `${prefix}/loyalty/${userId}`,
    redeemPoints: `${prefix}/loyalty/redeem`,
    adminUsersWithPoints: () => `${prefix}/admin/points`,

    getloyaltyConfig: `${prefix}/admin/config`,
    updateLoyaltyConfig: `${prefix}/admin/config`,

    loyaltyConfig: `${prefix}/user/config`,

    getBlogs: `${prefix}/user/blog`,
    getBlogById: (id) => `${prefix}/user/blog/${id}`,
    adminGetBlogs: `${prefix}/admin/blog`,
    adminCreateBlog: `${prefix}/admin/blog`,
    adminBlogById: (id) => `${prefix}/admin/blog/${id}`,

    // ✅ Profile
    AddProfile: `${prefix}/add/profile`,
    GetProfile: `${prefix}/get/profile`,

    addAdminProfile: `${prefix}/admin/add/profile`,
    getAdminProfile: `${prefix}/admin/get/profile`,

    // ✅ Booking
    bookTable: `${prefix}/book/table`,
    getBooking: `${prefix}/bookings`,
    putBooking: (id) => `${prefix}/bookings/${id}`,
    checkAvailability: (date, time) =>
      `${prefix}/availability?date=${date}&time=${time}`,
    deleteBooking: (id) => `${prefix}/bookings/${id}`,

    getNotifications: (email) => `${prefix}/notifications?email=${email}`,
    deleteNotification: (id) => `${prefix}/notifications/${id}`,
    deleteAllNotifications: `${prefix}/notifications`,

    huggingFaceGenerate: `${prefix}/cohere`,


    // ✅ Admin Auth
    adminregisterUser: `${prefix}/admin/register`,
    adminloginUser: `${prefix}/admin/login`,
    adminforgetPassword: `${prefix}/admin/forget/password`,
    adminotpVerify: `${prefix}/admin/otp/verify`,
    admingetOtpTime: `${prefix}/admin/otp/time`,
    adminupdatePassword: `${prefix}/admin/password/update`,
    admingetAccess: `${prefix}/admin/get/access`,
    adminloginviaFirebase: `${prefix}/admin/loginviafirebase`,
    adminsavePasswordMagicLink: `${prefix}/admin/save_password_magic_link`,
    adminuser: `${prefix}/admin/user`,
    adminlogoutAllDevices: `${prefix}/admin/logout-all`,
    adminlogout: `${prefix}/admin/logout`,
  };

  return list;
};
