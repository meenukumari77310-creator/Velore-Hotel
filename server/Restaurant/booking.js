import Booking from "../models/booking.js";
import { sendMail } from "../config/sendMail.js";
import Notification from "../models/notification.js";
// Set total tables (configurable)
const TOTAL_TABLES = 10; // You can move this to a config file if preferred

// GET /api/notifications
export const getNotifications = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const notifications = await Notification.find({ email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// DELETE /api/notifications?email=user@example.com
export const deleteAllNotifications = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await Notification.deleteMany({ email });
    res.json({ message: "All notifications deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notifications" });
  }
};


export const BookTable = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, userId, country, address } = req.body;

    const reservedCount = await Booking.countDocuments({
      date,
      time,
      status: { $ne: "canceled" },
    });

    if (reservedCount >= TOTAL_TABLES) {
      return res.status(400).json({ message: "No tables available at this time" });
    }

    const booking = new Booking({ name, email, phone, country, address, date, time, guests, userId });
    await booking.save();

    await sendMail({
      to: email,
      subject: "Table Booking Confirmation",
      html: `<h3>Hi ${name},</h3>
             <p>Your table booking for <strong>${date}</strong> at <strong>${time}</strong> has been received and is <b>pending</b> confirmation.</p>`
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getBookingData = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const putBookingData = async (req, res) => {
  try {
    const { status } = req.body;
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) return res.status(404).json({ message: "Booking not found" });

    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });


    // optionally create notification...
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // remove related transaction
    await Transaction.findOneAndDelete({ tableBookingId: booking._id });

    res.json({ message: "Booking deleted", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
// GET /api/availability?date=YYYY-MM-DD&time=HH:mm
export const getAvailability = async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required" });
  }

  try {
    const reserved = await Booking.countDocuments({
      date,
      time,
      status: { $ne: "canceled" },
    });

    const available = Math.max(0, TOTAL_TABLES - reserved);

    res.json({
      date,
      time,
      reserved,
      available,
      total: TOTAL_TABLES,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check availability" });
  }
};


