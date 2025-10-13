import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Super } from "./components/Super";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import { Register } from "./components/Register";
import Login from "./components/Login";
import FinishSignIn from "./components/FinishSignIn";
import SetPassword from "./components/SetPassword";
import { PasswordProtectedRoute } from "./components/PasswordProtectedRoute";
import UpdatePassword from "./components/UpdatePassword";
import ForgetFlow from "./components/ForgetFlow";
import ProtectedLayout from "./components/ProtectedLayout";
import Cart from "./pages/Cart";
import { Favorite } from "./pages/Favorite";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ReviewSection from "./pages/ReviewSection";
import AddDish from "./Admin/AddDish";
import ManageDishes from "./Admin/ManagesDish";
import EditDish from "./Admin/EditDish";
import Images from "./pages/Images";
import Booking from "./pages/Booking";
import AdminBookings from "./Admin/AdminBooking";
import { AdminRegister } from "./Admin/AdminRegister";
import AdminLogin from "./Admin/AdminLogin";
import AdminFinishSignIn from "./Admin/AdminFinishSignIn";
import AdminSetPassword from "./Admin/AdminSetPassword";
import { AdminPasswordProtectedRoute } from "./Admin/AdminPasswordProtectedRoute";
import AdminUpdatePassword from "./Admin/AdminUpdatePassword";
import AdminForgetFlow from "./Admin/AdminForgetFlow";
import AdminOrders from "./Admin/AdminOrder";
import AdminDashboard from "./Admin/AdminDashboard";
import { AdminRoute } from "./Admin/AdminRoute";
import AdminLayout from "./Admin/AdminLayout";
import AdminGalleryManager from "./Admin/AdminGalleryManager";
import AdminReviewPage from "./Admin/AdminReviewPage";
import AdminUserManagementPage from "./Admin/AdminUserManagement";
import AdminTeamManagement from "./Admin/AdminTeamManagement";
import ManageCategories from "./Admin/AdminCategory";
import AdminRestaurantSettings from "./Admin/AdminRestaurantSetting";
import AdminTestimonials from "./Admin/AdminTestinomial";
import AdminHowItWorks from "./Admin/AdminHowItWorks";
import AdminWhyChoose from "./Admin/AdminWhyChoose";
import AdminMission from "./Admin/AdminMission";
import AboutAdmin from "./Admin/AdminAboutIntro";
import AdminEvents from "./Admin/AdminEvents";
import EventBooking from "../src/pages/EventBooking";
import AdminLoyaltyPanel from "./Admin/AdminLoyaltyPanel";
import { UserProvider } from "./components/UserContext";
import { AdminUserProvider } from "./Admin/AdminUserContext";
import AdminBlogPanel from "./Admin/AdminBlogPanel";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetails";
import EventPaymentInfo from "./pages/EventPaymentInfo";
import AdminMessages from "./Admin/AdminMessages";
import UserEventView from "./pages/EventInfoBookingPage";
import AdminEventInfo from "./Admin/AdminEventInfo";
import AdminBookRoom from "./Admin/AdminBookRoom";
import BookRoom from "./pages/BookRoom";
import RoomDetails from "./pages/RoomDetails";
import AdminRoomDetail from "./Admin/AdminRoomDetails";
import BookingForm from "./pages/BookingForm";
import AdminRoomBookings from "./Admin/AdminRoomBookings";
import AdminHeroSection from "./Admin/AdminHeroSection";

function App() {
  const [isOtpVerified, setisOtpVerified] = useState(false);

  return (
    // ✅ Wrap entire app with both context providers
    <UserProvider>
      <AdminUserProvider>
        <Routes>
        
          {/* User Routes */}
          <Route element={<Super />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Home />} />
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
              <Route path="/booking-info" element={<UserEventView/>}/>
              <Route path="/room-booking" element={<BookRoom/>}/>
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/book/:id" element={<BookingForm />} />
              <Route
                path="/event-payment-info"
                element={<EventPaymentInfo />}
              />
            </Route>
          </Route>

          {/* Admin Auth Routes */}
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

          {/* Admin Protected Routes */}
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
              <Route path="/admin/event-info" element={<AdminEventInfo/>}/>
              <Route path="/admin/book-room" element={<AdminBookRoom/>}/>
              <Route path="/admin/room-details" element={<AdminRoomDetail/>}/>
              <Route
                path="/admin/restaurant-settings"
                element={<AdminRestaurantSettings />}
              />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/how-it-works" element={<AdminHowItWorks />} />
              <Route path="/admin/why-choose" element={<AdminWhyChoose />} />
              <Route path="/admin/mission" element={<AdminMission />} />
              <Route path="/admin/about-intro" element={<AboutAdmin />} />
              <Route path="/admin/room-booking" element={<AdminRoomBookings/>} />
              <Route path="/admin/hero-section" element={<AdminHeroSection/>}/>
            </Route>
          </Route>

          {/* User Auth Routes */}
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
      </AdminUserProvider>
    </UserProvider>
  );
}

export default App;
