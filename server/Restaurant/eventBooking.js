import EventBooking from "../models/eventBooking.js";
import User from "../models/user.js";
import { sendMail } from "../config/sendMail.js";
import Notification from "../models/notification.js";

export const bookEvent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      country, 
      address,
      date,
      time,
      guests,
      notes,
      userId,
      amount,
      usedPoints = 0, // ← receive from frontend
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !eventType ||
      !country||
      !address||
      !date ||
      !time ||
      !guests ||
      !userId ||
      amount === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate used points
    if (usedPoints > user.loyaltyPoints) {
      return res
        .status(400)
        .json({ message: "You don't have enough loyalty points." });
    }

    // Deduct used points
    if (usedPoints > 0) {
      user.loyaltyPoints -= usedPoints;
    }

    // Earn new points based on final amount
    const earnedPoints = Math.floor(amount / 100) * 10;
    user.loyaltyPoints += earnedPoints;
    await user.save();

    // Save booking
    const booking = new EventBooking({
      name,
      email,
      phone,
      eventType,
      country,
      address,
      date,
      time,
      guests,
      notes,
      userId,
      amount,
      usedPoints, // ← store it in the DB too
    });
    await booking.save();

    // Send notification
    if (earnedPoints > 0) {
      await Notification.create({
        email,
        userId,
        title: "Loyalty Points Earned",
        message: `You earned ${earnedPoints} loyalty points for your ${eventType} booking.`,
        type: "success",
        status: "unread",
        source: "event",
      });
    }

    // Send email
    await sendMail({
      to: email,
      subject: "Event Catering Request Received",
      html: `<p>Hi ${name}, we received your request for a ${eventType} on ${date}. You earned ${earnedPoints} points!</p>`,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
      earnedPoints,
      currentPoints: user.loyaltyPoints,
    });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

export const getUserEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const bookings = await EventBooking.find({ userId }).sort({ date: -1 });
    res.json({ events: bookings }); // 👈 important for frontend compatibility
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await EventBooking.find().sort({ createdAt: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { status, canceledBy = "admin" } = req.body; // ← added canceledBy
    const eventBooking = await EventBooking.findById(req.params.id);

    if (!eventBooking) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updated = await EventBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    console.log("Creating notification for event:", status, eventBooking.email);

    // ✅ Create a notification if confirmed or canceled
    if (["confirmed", "canceled", "declined"].includes(status)) {
      let message = "";

      if (status === "confirmed") {
        message = `Your event booking for ${eventBooking.eventType} on ${eventBooking.date} is confirmed.`;
      } else if (status === "canceled") {
        message =
          canceledBy === "user"
            ? `You canceled your event booking for ${eventBooking.eventType} on ${eventBooking.date}.`
            : `Unfortunately, your event booking for ${eventBooking.eventType} on ${eventBooking.date} has been canceled.`;
      } else if (status === "declined") {
        message = `Unfortunately, your event booking for ${eventBooking.eventType} on ${eventBooking.date} was declined.`;
      }

      await Notification.create({
        email: eventBooking.email,
        userId: eventBooking.userId,
        bookingId: eventBooking._id, // ✅ this ensures PayNowButton gets it
        title:
          status === "confirmed"
            ? "Event Booking Confirmed"
            : status === "canceled"
            ? canceledBy === "user"
              ? "You Canceled Your Event"
              : "Event Booking Canceled"
            : "Event Booking Declined",
        message,
        type: status === "confirmed" ? "success" : "error",
        status: "unread",
        source: "event",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const getEventBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await EventBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await EventBooking.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ points: user.loyaltyPoints || 0 });
  } catch {
    res.status(500).json({ message: "Failed to fetch points" });
  }
};

export const redeemPoints = async (req, res) => {
  const { userId, pointsToRedeem } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: "Not enough points" });
    }

    user.loyaltyPoints -= pointsToRedeem;
    await user.save();

    // ✅ Add notification
    await Notification.create({
      email: user.email,
      userId: user._id,
      title: "Points Redeemed",
      message: `You redeemed ${pointsToRedeem} loyalty points.`,
      type: "info",
      status: "unread",
      source: "loyalty",
    });

    res.json({
      message: "Points redeemed",
      currentPoints: user.loyaltyPoints,
    });
  } catch (err) {
    console.error("Redeem failed:", err);
    res.status(500).json({ message: "Redemption failed" });
  }
};

export const getAllUsersWithPoints = async (req, res) => {
  try {
    const users = await User.find({}, "name email loyaltyPoints");
    res.json(users);
  } catch (err) {
    console.error(err); // 👈 Add this
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
