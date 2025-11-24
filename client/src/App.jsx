import React, { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Super = lazy(() => import("./components/Super"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Menu = lazy(() => import("./pages/Menu"));
const Contact = lazy(() => import("./pages/Contact"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const FinishSignIn = lazy(() => import("./components/FinishSignIn"));
const SetPassword = lazy(() => import("./components/SetPassword"));
const PasswordProtectedRoute = lazy(() => import("./components/PasswordProtectedRoute"));
const UpdatePassword = lazy(() => import("./components/UpdatePassword"));
const ForgetFlow = lazy(() => import("./components/ForgetFlow"));
const ProtectedLayout = lazy(() => import("./components/ProtectedLayout"));
const Cart = lazy(() => import("./pages/Cart"));
const Favorite = lazy(() => import("./pages/Favorite"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const ReviewSection = lazy(() => import("./pages/ReviewSection"));
const AddDish = lazy(() => import("./Admin/AddDish"));
const ManageDishes = lazy(() => import("./Admin/ManagesDish"));
const EditDish = lazy(() => import("./Admin/EditDish"));
const Images = lazy(() => import("./pages/Images"));
const Booking = lazy(() => import("./pages/Booking"));
const AdminBookings = lazy(() => import("./Admin/AdminBooking"));
const AdminRegister = lazy(() => import("./Admin/AdminRegister"));
const AdminLogin = lazy(() => import("./Admin/AdminLogin"));
const AdminFinishSignIn = lazy(() => import("./Admin/AdminFinishSignIn"));
const AdminSetPassword = lazy(() => import("./Admin/AdminSetPassword"));
const AdminPasswordProtectedRoute = lazy(() => import("./Admin/AdminPasswordProtectedRoute"));
const AdminUpdatePassword = lazy(() => import("./Admin/AdminUpdatePassword"));
const AdminForgetFlow = lazy(() => import("./Admin/AdminForgetFlow"));
const AdminOrders = lazy(() => import("./Admin/AdminOrder"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const AdminRoute = lazy(() => import("./Admin/AdminRoute"));
const AdminLayout = lazy(() => import("./Admin/AdminLayout"));
const AdminGalleryManager = lazy(() => import("./Admin/AdminGalleryManager"));
const AdminReviewPage = lazy(() => import("./Admin/AdminReviewPage"));
const AdminUserManagementPage = lazy(() => import("./Admin/AdminUserManagement"));
const AdminTeamManagement = lazy(() => import("./Admin/AdminTeamManagement"));
const ManageCategories = lazy(() => import("./Admin/AdminCategory"));
const AdminRestaurantSettings = lazy(() => import("./Admin/AdminRestaurantSetting"));
const AdminTestimonials = lazy(() => import("./Admin/AdminTestinomial"));
const AdminHowItWorks = lazy(() => import("./Admin/AdminHowItWorks"));
const AdminWhyChoose = lazy(() => import("./Admin/AdminWhyChoose"));
const AdminMission = lazy(() => import("./Admin/AdminMission"));
const AboutAdmin = lazy(() => import("./Admin/AdminAboutIntro"));
const AdminEvents = lazy(() => import("./Admin/AdminEvents"));
const EventBooking = lazy(() => import("./pages/EventBooking"));
const AdminLoyaltyPanel = lazy(() => import("./Admin/AdminLoyaltyPanel"));
const AdminBlogPanel = lazy(() => import("./Admin/AdminBlogPanel"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetails"));
const EventPaymentInfo = lazy(() => import("./pages/EventPaymentInfo"));
const AdminMessages = lazy(() => import("./Admin/AdminMessages"));
const UserEventView = lazy(() => import("./pages/EventInfoBookingPage"));
const AdminEventInfo = lazy(() => import("./Admin/AdminEventInfo"));
const AdminBookRoom = lazy(() => import("./Admin/AdminBookRoom"));
const BookRoom = lazy(() => import("./pages/BookRoom"));
const RoomDetails = lazy(() => import("./pages/RoomDetails"));
const AdminRoomDetail = lazy(() => import("./Admin/AdminRoomDetails"));
const BookingForm = lazy(() => import("./pages/BookingForm"));
const AdminRoomBookings = lazy(() => import("./Admin/AdminRoomBookings"));
const AdminHeroSection = lazy(() => import("./Admin/AdminHeroSection"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

import { UserProvider } from "./components/UserContext";
import { AdminUserProvider } from "./Admin/AdminUserContext";

// Loader UI
const Loader = () => (
  <div style={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.8rem",
    fontWeight: "700",
  }}>
    ⏳ Loading...
  </div>
);

function App() {
  const [isOtpVerified, setisOtpVerified] = useState(false);

  return (
    <UserProvider>
      <AdminUserProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* User Routes */}
            <Route element={<Super />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/favorites" element={<Favorite />} />
                <Route path="/success" element={<PaymentSuccess />} />
                <Route path="/cancel" element={<PaymentCancel />} />
                <Route path="/review" element={<ReviewSection />} />
                <Route path="/images" element={<Images />} />
                <Route path="/book-table" element={<Booking />} />
                <Route path="/event-catering" element={<EventBooking />} />
                <Route path="/booking-info" element={<UserEventView />} />
                <Route path="/room-booking" element={<BookRoom />} />
                <Route path="/rooms/:id" element={<RoomDetails />} />
                <Route path="/book/:id" element={<BookingForm />} />
                <Route
                  path="/event-payment-info"
                  element={<EventPaymentInfo />}
                />
              </Route>
            </Route>

            {/* Admin Auth */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/finishSignIn" element={<AdminFinishSignIn />} />
            <Route path="/admin/set-password" element={<AdminSetPassword />} />
            <Route
              path="/admin/forget/password"
              element={<AdminForgetFlow setIsOtpVerified={setisOtpVerified} />}
            />
            <Route
              path="/admin/password/update"
              element={
                <AdminPasswordProtectedRoute isOtpVerified={isOtpVerified}>
                  <AdminUpdatePassword />
                </AdminPasswordProtectedRoute>
              }
            />

            {/* Admin Protected */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/booking" element={<AdminBookings />} />
                <Route path="/admin/blog" element={<AdminBlogPanel />} />
                <Route path="/add/dish" element={<AddDish />} />
                <Route path="/manage/dish" element={<ManageDishes />} />
                <Route path="/edit/dish/:id" element={<EditDish />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/loyalty" element={<AdminLoyaltyPanel />} />
                <Route path="/admin/gallery" element={<AdminGalleryManager />} />
                <Route path="/admin/reviews" element={<AdminReviewPage />} />
                <Route path="/admin/users" element={<AdminUserManagementPage />} />
                <Route path="/admin/team" element={<AdminTeamManagement />} />
                <Route path="/admin/category" element={<ManageCategories />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/event-info" element={<AdminEventInfo />} />
                <Route path="/admin/book-room" element={<AdminBookRoom />} />
                <Route path="/admin/room-details" element={<AdminRoomDetail />} />
                <Route
                  path="/admin/restaurant-settings"
                  element={<AdminRestaurantSettings />}
                />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/how-it-works" element={<AdminHowItWorks />} />
                <Route path="/admin/why-choose" element={<AdminWhyChoose />} />
                <Route path="/admin/mission" element={<AdminMission />} />
                <Route path="/admin/about-intro" element={<AboutAdmin />} />
                <Route path="/admin/room-booking" element={<AdminRoomBookings />} />
                <Route path="/admin/hero-section" element={<AdminHeroSection />} />
              </Route>
            </Route>

            {/* User Auth */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/finishSignIn" element={<FinishSignIn />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route
              path="/forget/password"
              element={<ForgetFlow setIsOtpVerified={setisOtpVerified} />}
            />
            <Route
              path="/password/update"
              element={
                <PasswordProtectedRoute isOtpVerified={isOtpVerified}>
                  <UpdatePassword />
                </PasswordProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AdminUserProvider>
    </UserProvider>
  );
}

export default App;
